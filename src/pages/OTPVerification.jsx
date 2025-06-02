import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: メールアドレス入力, 2: OTP入力
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // カウントダウンタイマーの処理
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // メールアドレスの検証
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // OTPコードを生成
  const generateOTP = () => {
    // デモ用に固定値を返す
    return "987654";
  };

  // メール送信処理（実際のアプリではAPIを呼び出す）
  const sendOTPEmail = (email, otp) => {
    console.log(`送信先: ${email}, OTP: ${otp}`);
    // 実際のアプリではここでメール送信APIを呼び出す
    return true;
  };

  // メールアドレス送信ハンドラー
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('正しいメールアドレスを入力してください');
      setEmail('');
      return;
    }

    // 指定されたメールアドレスのみ許可
    if (email.toLowerCase() !== 'iiwata@gmail.com') {
      setError('登録されていないメールアドレスです');
      setEmail('');
      return;
    }

    // デモ用の固定値OTPを生成
    const newOtp = generateOTP(); // 固定値 "987654" が返される
    setGeneratedOtp(newOtp);
    
    // OTPをメールで送信（実際のアプリではここで送信処理）
    const sent = sendOTPEmail(email, newOtp);
    
    if (sent) {
      setStep(2);
      setCountdown(300); // 5分間のカウントダウン
    } else {
      setError('OTPの送信に失敗しました。もう一度お試しください。');
    }
  };

  // OTP検証ハンドラー
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (otp === generatedOtp) {
      // OTPが一致したらWelcomeページに遷移
      navigate('/welcome');
    } else {
      setError('OTPが正しくありません。もう一度お試しください。');
    }
  };

  // 再送信ハンドラー
  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    const newOtp = generateOTP(); // 固定値 "987654" が返される
    setGeneratedOtp(newOtp);
    sendOTPEmail(email, newOtp);
    setCountdown(300);
    setError('');
  };

  // カウントダウン表示のフォーマット
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>WellCo オンボーディング</h2>
        </div>
        <div className="card-body">
          {step === 1 ? (
            // メールアドレス入力フォーム
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <h3>メールアドレスを入力してください</h3>
                <p>登録されているメールアドレスにワンタイムパスワードを送信します。</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレス"
                  required
                  className="form-control"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn btn-primary">
                ワンタイムパスワードを送信
              </button>
            </form>
          ) : (
            // OTP入力フォーム
            <form onSubmit={handleOtpSubmit}>
              <div className="form-group">
                <h3>ワンタイムパスワードを入力してください</h3>
                <p>
                  {email} に6桁のワンタイムパスワードを送信しました。
                  <br />
                  メールに記載されたコードを入力してください。
                </p>
                <p className="demo-note">
                  <strong>デモ用注意:</strong> ワンタイムパスワードは <strong>987654</strong> です。
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6桁のコード"
                  maxLength={6}
                  required
                  className="form-control otp-input"
                />
                <div className="countdown">
                  {countdown > 0 ? (
                    <span>有効期限: {formatCountdown()}</span>
                  ) : (
                    <span className="expired">有効期限が切れました</span>
                  )}
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className={`btn btn-outline ${countdown > 0 ? 'disabled' : ''}`}
                  disabled={countdown > 0}
                >
                  再送信
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={countdown === 0}
                >
                  確認
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="card-footer">
          <p>© 2025 WellCo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
