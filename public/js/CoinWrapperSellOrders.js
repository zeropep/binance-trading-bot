/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperSellOrders extends React.Component {
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
      symbolConfiguration,
      quoteAssetBalance: { asset: quoteAsset },
      sell
    } = symbolInfo;

    if (sell.openOrders.length === 0) {
      return '';
    }

    const { collapsed } = this.state;

    const precision = parseFloat(tickSize) === 1 ? 0 : tickSize.indexOf(1) - 1;

    const {
      sell: { currentGridTradeIndex, gridTrade }
    } = symbolConfiguration;

    const sellGridRows = gridTrade.map((grid, i) => {
      return (
        <React.Fragment key={'coin-wrapper-sell-grid-row-' + symbol + '-' + i}>
          <div className='coin-info-column-grid'>
            <div className='coin-info-column coin-info-column-price'>
              <span className='coin-info-label'>Grid Trade #{i + 1}</span>

              <div className='coin-info-value'>
                <OverlayTrigger
                  trigger='click'
                  key={'sell-signal-' + symbol + '-' + i + '-overlay'}
                  placement='bottom'
                  overlay={
                    <Popover
                      id={'sell-signal-' + symbol + '-' + i + '-overlay-right'}>
                      <Popover.Content>
                        {grid.executed ? (
                          <React.Fragment>
                            그리드 거래 #{i + 1}이(가) 실행되었습니다.
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            그리드 거래 #{i + 1}이(가) 아직 실행되지 않았습니다.{' '}
                            {currentGridTradeIndex === i
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
              <div className='coin-info-column coin-info-column-order'>
                <span className='coin-info-label'>
                  - 매도 수량 비율:
                </span>
                <div className='coin-info-value'>
                  {(grid.quantityPercentage * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    const renderOpenOrders = sell.openOrders.map((openOrder, index) => {
      return (
        <div
          key={'coin-wrapper-sell-order-' + index}
          className='coin-info-sub-open-order-wrapper'>
          <div className='coin-info-column coin-info-column-title'>
            <div className='coin-info-label d-flex flex-row'>
              <span>Open Order #{index + 1}</span>{' '}
              <SymbolCancelIcon
                symbol={symbol}
                order={openOrder}
                sendWebSocket={sendWebSocket}
                isAuthenticated={isAuthenticated}
              />
            </div>

            {openOrder.updatedAt && moment(openOrder.updatedAt).isValid() ? (
              <HightlightChange
                className='coin-info-value'
                title={openOrder.updatedAt}>
                {moment(openOrder.updatedAt).format('HH:mm:ss')}에 주문됨
              </HightlightChange>
            ) : (
              ''
            )}
          </div>
          <div className='coin-info-column coin-info-column-order'>
            <span className='coin-info-label'>Status:</span>
            <HightlightChange className='coin-info-value'>
              {openOrder.status}
            </HightlightChange>
          </div>
          <div className='coin-info-column coin-info-column-order'>
            <span className='coin-info-label'>Type:</span>
            <HightlightChange className='coin-info-value'>
              {openOrder.type}
            </HightlightChange>
          </div>
          <div className='coin-info-column coin-info-column-order'>
            <span className='coin-info-label'>Qty:</span>
            <HightlightChange className='coin-info-value'>
              {parseFloat(openOrder.origQty).toFixed(precision)}
            </HightlightChange>
          </div>
          {openOrder.price > 0 ? (
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>Price:</span>
              <HightlightChange className='coin-info-value'>
                {parseFloat(openOrder.price).toFixed(precision)}
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          {openOrder.stopPrice > 0 ? (
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>Stop Price:</span>
              <HightlightChange className='coin-info-value'>
                {parseFloat(openOrder.stopPrice).toFixed(precision)}
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          <div className='coin-info-column coin-info-column-price divider'></div>

          {openOrder.currentPrice ? (
            <div className='coin-info-column coin-info-column-price'>
              <span className='coin-info-label'>Current price:</span>
              <HightlightChange className='coin-info-value'>
                {parseFloat(openOrder.currentPrice).toFixed(precision)}
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          {openOrder.minimumProfit ? (
            <div className='coin-info-column coin-info-column-price'>
              <span className='coin-info-label'>최소 수익:</span>
              <HightlightChange className='coin-info-value'>
                {parseFloat(openOrder.minimumProfit).toFixed(precision)}{' '}
                {quoteAsset} (
                {parseFloat(openOrder.minimumProfitPercentage).toFixed(2)}%)
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          <div className='coin-info-column coin-info-column-price divider'></div>
          {openOrder.limitPrice ? (
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>현재 지정가:</span>
              <HightlightChange className='coin-info-value'>
                {parseFloat(openOrder.limitPrice).toFixed(precision)}
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          {openOrder.differenceToCancel ? (
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>취소까지 차이:</span>
              <HightlightChange className='coin-info-value'>
                {openOrder.differenceToCancel.toFixed(2)}%
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          {openOrder.currentPrice ? (
            <div className='coin-info-column coin-info-column-price'>
              <span className='coin-info-label'>Current price:</span>
              <HightlightChange className='coin-info-value'>
                {openOrder.currentPrice.toFixed(precision)}
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
          {openOrder.differenceToExecute ? (
            <div className='coin-info-column coin-info-column-order'>
              <span className='coin-info-label'>실행까지 차이:</span>
              <HightlightChange className='coin-info-value'>
                {openOrder.differenceToExecute.toFixed(2)}%
              </HightlightChange>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    });

    return (
      <div className='coin-info-sub-wrapper'>
        <div className='coin-info-column coin-info-column-title'>
          <div className='coin-info-label'>
            매도 미체결 주문{' '}
            <span className='coin-info-value'>
              {symbolConfiguration.sell.enabled ? (
                <i className='fas fa-toggle-on'></i>
              ) : (
                <i className='fas fa-toggle-off'></i>
              )}
            </span>
          </div>
        </div>

        <CoinWrapperSellLastBuyPrice
          symbolInfo={symbolInfo}
          sendWebSocket={sendWebSocket}
          isAuthenticated={isAuthenticated}></CoinWrapperSellLastBuyPrice>

        {sellGridRows}

        {renderOpenOrders}
      </div>
    );
  }
}
