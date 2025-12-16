/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class CoinWrapperAction extends React.Component {
  render() {
    const {
      symbolInfo: {
        symbol,
        action,
        buy,
        isLocked,
        isActionDisabled,
        overrideData
      },
      sendWebSocket,
      isAuthenticated
    } = this.props;

    let label;
    switch (action) {
      case 'buy':
        label = '매수';
        break;
      case 'buy-temporary-disabled':
        label = '일시 중지됨';
        break;
      case 'buy-order-checking':
        label = '매수 주문 확인 중';
        break;
      case 'buy-order-wait':
        label = '매수 주문 대기 중';
        break;
      case 'sell':
        label = '매도';
        break;
      case 'sell-temporary-disabled':
        label = '일시 중지됨';
        break;
      case 'sell-stop-loss':
        label = '손절매 실행 중';
        break;
      case 'sell-order-checking':
        label = '매도 주문 확인 중';
        break;
      case 'sell-order-wait':
        label = '매도 주문 대기 중';
        break;
      case 'sell-wait':
        label = '대기';
        break;
      default:
        label = '대기';
    }

    if (isLocked) {
      label = '잠김';
    }

    if (isActionDisabled.isDisabled) {
      label = `${isActionDisabled.disabledBy}에 의해 비활성화됨`;
    }

    let renderOverrideAction = '';
    if (_.isEmpty(overrideData) === false) {
      renderOverrideAction = (
        <div className='coin-info-column coin-info-column-title border-bottom-0 m-0 p-0'>
          <div
            className='w-100 px-1 text-warning'
            title={overrideData.actionAt}>
            <strong>{overrideData.action}</strong> 작업이{' '}
            {moment(overrideData.actionAt).fromNow()} 후 실행됩니다.{' '}
            ({overrideData.triggeredBy}에 의해 트리거됨)
          </div>
        </div>
      );
    }

    const updatedAt = moment
      .utc(buy.updatedAt, 'YYYY-MM-DDTHH:mm:ss.SSSSSS')
      .local();
    const currentTime = moment.utc().local();

    return (
      <div className='coin-info-sub-wrapper'>
        <div className='coin-info-column coin-info-column-title border-bottom-0 mb-0 pb-0'>
          <div className='coin-info-label'>
            Action -{' '}
            <HightlightChange className='coin-info-value' id='updated-at'>
              {updatedAt.format('HH:mm:ss')}
            </HightlightChange>
            {isLocked === true ? <i className='fas fa-lock ml-1'></i> : ''}
            {isActionDisabled.isDisabled === true ? (
              <i className='fas fa-pause-circle ml-1 text-warning'></i>
            ) : (
              ''
            )}
            {updatedAt.isBefore(currentTime, 'minute') ? (
              <OverlayTrigger
                trigger='click'
                key='action-updated-at-alert-overlay'
                placement='bottom'
                overlay={
                  <Popover id='action-updated-at-alert-overlay-right'>
                    <Popover.Content>
                      봇이 1분 이상 가격 변화를 수신하지 못했습니다.
                      바이낸스에서 가격이 변하지 않았다는 의미입니다.
                      새로운 가격 변화가 수신되면 업데이트됩니다.
                      <br />
                      <br />
                      마지막 업데이트: {updatedAt.fromNow()}
                    </Popover.Content>
                  </Popover>
                }>
                <Button
                  variant='link'
                  className='p-0 m-0 ml-1 text-white-50 d-inline-block'
                  style={{ lineHeight: '17px' }}>
                  <i className='fas fa-exclamation-circle mx-1'></i>
                </Button>
              </OverlayTrigger>
            ) : (
              ''
            )}
          </div>

          <div className='d-flex flex-column align-items-end'>
            <HightlightChange
              className={`action-label ${
                label.length < 10 ? 'badge-pill badge-dark' : ''
              }`}>
              {label}
            </HightlightChange>
            {isActionDisabled.isDisabled === true ? (
              <div className='ml-1'>
                {isActionDisabled.canResume === true ? (
                  <SymbolEnableActionIcon
                    symbol={symbol}
                    className='mr-1'
                    sendWebSocket={sendWebSocket}
                    isAuthenticated={isAuthenticated}></SymbolEnableActionIcon>
                ) : (
                  ''
                )}
                ({moment.duration(isActionDisabled.ttl, 'seconds').humanize()}{' '}
                남음){' '}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        {renderOverrideAction}
      </div>
    );
  }
}
