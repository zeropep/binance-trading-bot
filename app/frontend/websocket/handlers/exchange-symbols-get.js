const _ = require('lodash');
const { cache } = require('../../../helpers');

const handleExchangeSymbolsGet = async (logger, ws, _payload) => {
  // Get cached exchange symbols
  const exchangeSymbols =
    JSON.parse(await cache.hget('trailing-trade-common', 'exchange-symbols')) ||
    {};

  // Get all TradingView data from cache (collected for all USDT pairs)
  const rawTradingViewData = await cache.hgetall(
    'trailing-trade-tradingview-all:',
    'trailing-trade-tradingview-all:*'
  );

  const tradingViewData = _.mapValues(rawTradingViewData || {}, data => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  });

  logger.info(
    { tradingViewCount: Object.keys(tradingViewData).length },
    'TradingView data loaded for symbols dropdown'
  );

  // Add TradingView recommendation to each symbol
  const enrichedExchangeSymbols = _.mapValues(
    exchangeSymbols,
    (symbolInfo, symbol) => {
      // Try to find TradingView data for this symbol (using 1h interval)
      const tvKey = `${symbol}:1h`;
      const tvData = tradingViewData[tvKey];

      let tradingViewRecommendation = null;
      let tradingViewUpdatedAt = null;

      if (tvData && tvData.result && tvData.result.summary) {
        tradingViewRecommendation =
          tvData.result.summary.RECOMMENDATION || null;
        tradingViewUpdatedAt = tvData.request?.updatedAt || null;
      }

      return {
        ...symbolInfo,
        tradingViewRecommendation,
        tradingViewUpdatedAt
      };
    }
  );

  ws.send(
    JSON.stringify({
      result: true,
      type: 'exchange-symbols-get-result',
      exchangeSymbols: enrichedExchangeSymbols
    })
  );
};

module.exports = { handleExchangeSymbolsGet };
