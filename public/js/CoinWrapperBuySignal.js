/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperBuySignal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const { symbolInfo, sendWebSocket, isAuthenticated } = this.props;

    const {
      symbolInfo: {
        symbol,
        filterPrice: { tickSize }
      },
      quoteAssetBalance: { asset: quoteAsset },
      symbolConfiguration,
      buy,
      sell
    } = symbolInfo;

    const { collapsed } = this.state;

    const precision = parseFloat(tickSize) === 1 ? 0 : tickSize.indexOf(1) - 1;

    const {
      buy: { currentGridTradeIndex, gridTrade }
    } = symbolConfiguration;

    let hiddenCount = 0;

    const buyGridRows = gridTrade.map((grid, i) => {
      const modifiedGridTradeIndex = Math.min(
        Math.max(currentGridTradeIndex, 5),
        gridTrade.length - 5
      );

      function hiddenRow(i) {
        return (
          i >= 3 &&
          (i <= modifiedGridTradeIndex - 3 ||
            i >= modifiedGridTradeIndex + 4) &&
          i < gridTrade.length - 1
        );
      }

      const isNextHidden = hiddenRow(i + 1);
      const isHidden = isNextHidden || hiddenRow(i);

      if (isHidden === true) {
        hiddenCount++;

        return isNextHidden === true ? (
          ''
        ) : (
          <React.Fragment
            key={'coin-wrapper-buy-grid-row-hidden-' + symbol + '-' + (i - 1)}>
            <div className='coin-info-column-grid'>
              <div className='coin-info-column coin-info-column-price'>
                <div className='coin-info-label text-center text-muted'>
                  ... {hiddenCount}개 그리드 거래 숨김 ...
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      } else {
        hiddenCount = 0;
      }

      return (
        <React.Fragment key={'coin-wrapper-buy-grid-row-' + symbol + '-' + i}>
          <div className='coin-info-column-grid'>
            <div className='coin-info-column coin-info-column-price'>
              <div className='coin-info-label'>Grid Trade #{i + 1}</div>

              <div className='coin-info-value'>
                {buy.openOrders.length === 0 &&
                sell.openOrders.length === 0 &&
                currentGridTradeIndex === i ? (
                  <SymbolTriggerBuyIcon
                    symbol={symbol}
                    sendWebSocket={sendWebSocket}
                    isAuthenticated={isAuthenticated}></SymbolTriggerBuyIcon>
                ) : (
                  ''
                )}

                <OverlayTrigger
                  trigger='click'
                  key={'buy-signal-' + symbol + '-' + i + '-overlay'}
                  placement='bottom'
                  overlay={
                    <Popover
                      id={'buy-signal-' + symbol + '-' + i + '-overlay-right'}>
                      <Popover.Content>
                        {grid.executed ? (
                          <React.Fragment>
                            <span>
                              그리드 거래 #{i + 1}이(가){' '}
                              {moment(grid.executedOrder.updateTime).fromNow()}{' '}
                              ({moment(grid.executedOrder.updateTime).format()}
                              )에 실행되었습니다.
                            </span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            그리드 거래 #{i + 1}이(가) 아직 실행되지 않았습니다.{' '}
                            {sell.lastBuyPrice > 0
                              ? i === 0
                                ? '마지막 매수 가격이 기록되어 있고 첫 번째 그리드 거래가 실행되지 않았기 때문에 이 그리드 거래는 실행되지 않습니다.'
                                : currentGridTradeIndex === i
                                ? `실행 대기 중입니다.`
                                : `그리드 거래 #${i} 실행 대기 중입니다.`
                              : currentGridTradeIndex === i
                              ? '실행 대기 중입니다.'
                              : `그리드 거래 #${i} 실행 대기 중입니다.`}
                          </React.Fragment>
                        )}
                      </Popover.Content>
                    </Popover>
                  }>
                  <Button
                    variant='link'
                    className='p-0 m-0 ml-1 text-warning d-inline-block'
                    style={{ lineHeight: '17px' }}>
                    {grid.executed ? (
                      // If already executed, then shows executed icon.
                      <i className='fas fa-check-square'></i>
                    ) : sell.lastBuyPrice > 0 ? (
                      i === 0 ? (
                        <i className='far fa-clock text-muted'></i>
                      ) : currentGridTradeIndex === i ? (
                        <i className='far fa-clock'></i>
                      ) : (
                        <i className='far fa-clock text-muted'></i>
                      )
                    ) : currentGridTradeIndex === i ? (
                      <i className='far fa-clock'></i>
                    ) : (
                      <i className='far fa-clock text-muted'></i>
                    )}
                  </Button>
                </OverlayTrigger>

                <button
                  type='button'
                  className='btn btn-sm btn-link p-0 ml-1'
                  onClick={this.toggleCollapse}>
                  <i
                    className={`fas ${
                      collapsed ? 'fa-arrow-right' : 'fa-arrow-down'
                    }`}></i>
                </button>
              </div>
            </div>

            {buy.triggerPrice && currentGridTradeIndex === i ? (
              <div className='coin-info-column coin-info-column-price'>
                <div
                  className='coin-info-label d-flex flex-row justify-content-start'
                  style={{ flex: '0 100%' }}>
                  <span>
                    &#62; Trigger price (
                    {(parseFloat(grid.triggerPercentage - 1) * 100).toFixed(2)}
                    %):
                  </span>
                  {i === 0 &&
                  symbolConfiguration.buy.athRestriction.enabled &&
                  parseFloat(buy.triggerPrice) >
                    parseFloat(buy.athRestrictionPrice) ? (
                    <OverlayTrigger
                      trigger='click'
                      key='buy-trigger-price-overlay'
                      placement='bottom'
                      overlay={
                        <Popover id='buy-trigger-price-overlay-right'>
                          <Popover.Content>
                            트리거 가격{' '}
                            <code>
                              {parseFloat(buy.triggerPrice).toFixed(precision)}
                            </code>
                            이(가) ATH 매수 제한 가격{' '}
                            <code>
                              {parseFloat(buy.athRestrictionPrice).toFixed(
                                precision
                              )}
                            </code>
                            보다 높습니다. 현재 가격이 트리거 가격에 도달해도
                            봇은 주문을 넣지 않습니다.
                          </Popover.Content>
                        </Popover>
                      }>
                      <Button
                        variant='link'
                        className='p-0 m-0 ml-1 text-warning d-inline-block'
                        style={{ lineHeight: '17px' }}>
                        <i className='fas fa-info-circle fa-sm'></i>
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    ''
                  )}
                </div>
                <HightlightChange
                  className={`coin-info-value ${
                    symbolConfiguration.buy.athRestriction.enabled &&
                    parseFloat(buy.triggerPrice) >
                      parseFloat(buy.athRestrictionPrice)
                      ? 'text-warning'
                      : ''
                  }`}>
                  {parseFloat(buy.triggerPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            {buy.difference && currentGridTradeIndex === i ? (
              <div className='coin-info-column coin-info-column-price'>
                <span className='coin-info-label'>매수까지 차이:</span>
                <HightlightChange
                  className={`coin-info-value ${
                    buy.difference > 0
                      ? 'text-success'
                      : buy.difference < 0
                      ? 'text-danger'
                      : ''
                  }`}
                  id='buy-difference'>
                  {parseFloat(buy.difference).toFixed(2)}%
                </HightlightChange>
              </div>
            ) : (
              ''
            )}

            {grid.executed && grid.executedOrder.currentGridTradeIndex === i ? (
              <div
                className={`coin-info-content-setting ${
                  collapsed ? 'd-none' : ''
                }`}>
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>- 매수 일시:</span>
                  <div className='coin-info-value'>
                    {moment(grid.executedOrder.transactTime).format(
                      'YYYY-MM-DD HH:mm'
                    )}
                  </div>
                </div>
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>- 매수 가격:</span>
                  <div className='coin-info-value'>
                    {parseFloat(grid.executedOrder.price).toFixed(precision)}
                  </div>
                </div>
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>- 매수 수량:</span>
                  <div className='coin-info-value'>
                    {parseFloat(grid.executedOrder.executedQty)}
                  </div>
                </div>
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>- 매수 금액:</span>
                  <div className='coin-info-value'>
                    {parseFloat(grid.executedOrder.cummulativeQuoteQty).toFixed(
                      precision
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            <div
              className={`coin-info-content-setting ${
                collapsed ? 'd-none' : ''
              }`}>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 트리거 가격 비율:
                </span>
                <div className='coin-info-value'>
                  {((grid.triggerPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 손절 가격 비율:
                </span>
                <div className='coin-info-value'>
                  {((grid.stopPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 지정가 비율:
                </span>
                <div className='coin-info-value'>
                  {((grid.limitPercentage - 1) * 100).toFixed(2)}%
                </div>
              </div>
              {grid.minPurchaseAmount > 0 ? (
                <div className='coin-info-column coin-info-column-order'>
                  <span className='coin-info-label'>
                    - 최소 매수 금액:
                  </span>
                  <div className='coin-info-value'>
                    {grid.minPurchaseAmount} {quoteAsset}
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>- 최대 매수 금액:</span>
                <div className='coin-info-value'>
                  {grid.maxPurchaseAmount} {quoteAsset}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    const buyNextGrid = () => {
      const nextGridAmount = buy.nextBestBuyAmount;

      return (
        <React.Fragment key={'coin-wrapper-buy-next-grid-row-' + symbol}>
          <div className='coin-info-column coin-info-column-price'>
            <span className='coin-info-label'>
              &#62; 추천 손익분기 금액
              <SymbolGridCalculator
                symbol={symbol}
                symbolInfo={symbolInfo}
                isAuthenticated={isAuthenticated}
              />
            </span>
            <span className='coin-info-value'>
              {nextGridAmount !== null && nextGridAmount > 0
                ? `${nextGridAmount.toFixed(precision)} ${quoteAsset}`
                : 'N/A'}
            </span>
          </div>
        </React.Fragment>
      );
    };

    return (
      <div className='coin-info-sub-wrapper'>
        <div className='coin-info-column coin-info-column-title'>
          <div className='coin-info-label'>
            Buy Signal ({symbolConfiguration.candles.interval}/
            {symbolConfiguration.candles.limit}){' '}
            <span className='coin-info-value'>
              {symbolConfiguration.buy.enabled ? (
                <i className='fas fa-toggle-on'></i>
              ) : (
                <i className='fas fa-toggle-off'></i>
              )}
            </span>{' '}
          </div>
          {symbolConfiguration.buy.enabled === false ? (
            <HightlightChange className='coin-info-message badge-pill badge-danger'>
              거래가 비활성화되어 있습니다.
            </HightlightChange>
          ) : (
            ''
          )}
        </div>
        {symbolConfiguration.buy.athRestriction.enabled ? (
          <div className='d-flex flex-column w-100'>
            {buy.athPrice ? (
              <div className='coin-info-column coin-info-column-price'>
                <span className='coin-info-label'>
                  ATH price (
                  {symbolConfiguration.buy.athRestriction.candles.interval}/
                  {symbolConfiguration.buy.athRestriction.candles.limit}):
                </span>
                <HightlightChange className='coin-info-value'>
                  {parseFloat(buy.athPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            {buy.athRestrictionPrice ? (
              <div className='coin-info-column coin-info-column-price'>
                <div
                  className='coin-info-label d-flex flex-row justify-content-start'
                  style={{ flex: '0 100%' }}>
                  <span>
                    &#62; Restricted price (
                    {(
                      parseFloat(
                        symbolConfiguration.buy.athRestriction
                          .restrictionPercentage - 1
                      ) * 100
                    ).toFixed(2)}
                    %):
                  </span>
                  <OverlayTrigger
                    trigger='click'
                    key='buy-ath-restricted-price-overlay'
                    placement='bottom'
                    overlay={
                      <Popover id='buy-ath-restricted-price-overlay-right'>
                        <Popover.Content>
                          봇은 트리거 가격이 ATH 제한 가격보다 낮을 때 매수
                          주문을 넣습니다. 현재 가격이 트리거 가격에 도달해도
                          현재 가격이 ATH 제한 가격보다 높으면 코인을 매수하지
                          않습니다. ATH로 매수를 제한하지 않으려면 설정에서
                          ATH 가격 제한을 비활성화하세요.
                        </Popover.Content>
                      </Popover>
                    }>
                    <Button
                      variant='link'
                      className='p-0 m-0 ml-1 text-info d-inline-block'
                      style={{ lineHeight: '17px' }}>
                      <i className='fas fa-question-circle fa-sm'></i>
                    </Button>
                  </OverlayTrigger>
                </div>
                <HightlightChange
                  className={`coin-info-value ${
                    symbolConfiguration.buy.athRestriction.enabled &&
                    parseFloat(buy.triggerPrice) >
                      parseFloat(buy.athRestrictionPrice)
                      ? 'text-warning'
                      : ''
                  }`}>
                  {parseFloat(buy.athRestrictionPrice).toFixed(precision)}
                </HightlightChange>
              </div>
            ) : (
              ''
            )}
            <div className='coin-info-column coin-info-column-price divider'></div>
          </div>
        ) : (
          ''
        )}

        {buy.highestPrice ? (
          <div className='coin-info-column coin-info-column-price'>
            <span className='coin-info-label'>최고가:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.highestPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        {buy.currentPrice ? (
          <div className='coin-info-column coin-info-column-price'>
            <span className='coin-info-label'>현재가:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.currentPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        {buy.lowestPrice ? (
          <div className='coin-info-column coin-info-column-lowest-price'>
            <span className='coin-info-label'>최저가:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(buy.lowestPrice).toFixed(precision)}
            </HightlightChange>
          </div>
        ) : (
          ''
        )}
        <div className='coin-info-column coin-info-column-price divider mb-1'></div>
        {buyGridRows}
        {buyNextGrid()}
        {buy.processMessage ? (
          <div className='d-flex flex-column w-100'>
            <div className='coin-info-column coin-info-column-price divider'></div>
            <div className='coin-info-column coin-info-column-message text-warning'>
              <HightlightChange className='coin-info-message'>
                {buy.processMessage}
              </HightlightChange>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
