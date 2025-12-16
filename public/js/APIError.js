/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
class APIError extends React.Component {
  componentDidMount() {
    document.body.classList.add('app-locked');
  }

  componentWillUnmount() {
    document.body.classList.remove('app-locked');
  }

  render() {
    return (
      <div className='app-lock-screen flex-column d-flex h-100 justify-content-center align-content-center'>
        <div className='lock-screen-wrapper d-flex flex-column justify-content-center'>
          <h1 className='app-h1 my-2 mb-3 text-center'>
            <img
              src='./img/binance.png'
              className='binance-img'
              alt='Binance logo'
            />{' '}
            Binance Trading Bot
          </h1>

          <h3 className='text-danger'>
            계정 정보를 불러오는데 실패했습니다.
          </h3>

          <div className='text-left'>
            <p>
              다음 상황 중 하나로 인해 이 오류 메시지가 표시됩니다:
              <br />
              <ul>
                <li>실제 바이낸스에 테스트넷 API/Secret을 사용하고 있습니다.</li>
                <li>테스트넷 바이낸스에 실제 API/Secret을 사용하고 있습니다.</li>
                <li>API 키가 취소/삭제되었습니다.</li>
                <li>
                  API 키에 "읽기 활성화" 및 "현물 & 마진 거래 활성화" 권한이
                  없습니다.
                </li>
                <li>
                  API 키가 신뢰할 수 있는 IP로 제한되어 있고, 봇이 신뢰할 수 있는
                  IP에 있지 않습니다.
                </li>
              </ul>
            </p>
            <p>
              다음 문서를 주의 깊게 읽고 설정을 업데이트한 후 봇을 다시
              실행하세요.
              <br />
              <a
                href='https://github.com/chrisleekr/binance-trading-bot/wiki/Install#how-to-install'
                target='_blank'
                rel='noreferrer'>
                https://github.com/chrisleekr/binance-trading-bot/wiki/Install#how-to-install
              </a>
              <br />
              <br />
              API 키/시크릿을 확인한 후에도 문제가 지속되면 Github에 새 이슈를
              열어주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
