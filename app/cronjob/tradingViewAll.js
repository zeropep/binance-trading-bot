const qs = require('qs');
const _ = require('lodash');
const axios = require('axios');
const config = require('config');
const { cache } = require('../helpers');
const { errorHandlerWrapper } = require('../error-handler');

/**
 * Retrieve TradingView data for multiple symbols
 *
 * @param {*} logger
 * @param {*} symbols
 * @param {*} interval
 */
const retrieveTradingView = async (logger, symbols, interval) => {
  const params = {
    symbols: symbols.map(s => `BINANCE:${s}`),
    screener: 'CRYPTO',
    interval
  };

  try {
    const tradingviewUrl = `http://${config.get(
      'tradingview.host'
    )}:${config.get('tradingview.port')}`;

    const response = await axios.get(tradingviewUrl, {
      params,
      paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' }),
      timeout: 30000
    });

    const tradingViewResult = _.get(response.data, 'result', {});

    if (_.isEmpty(tradingViewResult)) {
      return;
    }

    const promises = [];
    _.forIn(tradingViewResult, (result, symbolKey) => {
      const symbol = symbolKey.replace('BINANCE:', '');
      const recommendation = _.get(result, 'summary.RECOMMENDATION', '');

      if (recommendation !== '') {
        promises.push(
          cache.hset(
            'trailing-trade-tradingview-all',
            `${symbol}:${interval}`,
            JSON.stringify({
              request: {
                symbol,
                screener: 'CRYPTO',
                exchange: 'BINANCE',
                interval,
                updatedAt: new Date().toISOString()
              },
              result
            })
          )
        );
      }
    });

    await Promise.all(promises);
    logger.info(
      { count: promises.length },
      `Saved ${promises.length} TradingView recommendations`
    );
  } catch (err) {
    logger.error(
      { err },
      'Error retrieving TradingView data for all symbols'
    );
  }
};

/**
 * Execute TradingView data collection for all USDT pairs
 */
const execute = async logger => {
  await errorHandlerWrapper(logger, 'TradingViewAll', async () => {
    logger.info('tradingViewAll started');

    // Get all exchange symbols from cache
    const exchangeSymbolsRaw = await cache.hget(
      'trailing-trade-common',
      'exchange-symbols'
    );

    if (!exchangeSymbolsRaw) {
      logger.info('No exchange symbols found in cache');
      return;
    }

    const exchangeSymbols = JSON.parse(exchangeSymbolsRaw);

    // Filter USDT pairs that are actively trading
    const usdtSymbols = Object.values(exchangeSymbols)
      .filter(s => s.quoteAsset === 'USDT' && s.status === 'TRADING')
      .map(s => s.symbol);

    logger.info({ count: usdtSymbols.length }, 'Found USDT trading pairs');

    if (usdtSymbols.length === 0) {
      return;
    }

    // TradingView API can handle batch requests, but we'll chunk to avoid timeouts
    const chunkSize = 50;
    const chunks = _.chunk(usdtSymbols, chunkSize);
    const interval = '1h';

    for (const chunk of chunks) {
      // eslint-disable-next-line no-await-in-loop
      await retrieveTradingView(logger, chunk, interval);
      // Small delay between chunks to avoid overwhelming the API
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    logger.info('tradingViewAll completed');
  });
};

module.exports = { execute };
