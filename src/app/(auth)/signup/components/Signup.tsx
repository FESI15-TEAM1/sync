"use client"

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Signup() {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationCodeError, setVerificationCodeError] = useState("");
    const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
    const [nicknameError, setNicknameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const handleCheckNickname = () => {
        if (!nickname.trim) {
            setNickname("닉네임을 입력해주세요.");
            setIsNicknameValid(false);
            return;
        }
    }

    const handleCheckEmail = () => {
        if (!email.trim) {
            setEmailError("이메일을 입력해주세요.")
            setIsEmailValid(false);
            return;
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isNicknameValid) {
            setNicknameError("닉네임 중복확인을 해주세요");
            return;
        } 

        if (!isEmailValid) {
            setEmailError("이메일 형식을 확인해주세요");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("비밀번호가 일치하지 않습니다");
            return;
        }
    }
    const handleVerifyCode = () => {
        if (!verificationCode.trim) {
            setVerificationCodeError("인증코드를 입력해주세요.");
            setIsVerificationCodeValid(false);
            return;
        }
    }
    return (<main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10 bg-bg-primary">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">Sync</h1>
            <p className="mt-2 text-base leading-relaxed text-text-secondary">몇 초면 가입 완료</p>
            <br />
            <p className="mt-2 text-base leading-relaxed text-text-secondary">지금 바로 그룹을 만들어보세요.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-end gap-3">
                <Input label="닉네임" errorMessage={nicknameError} value={nickname} onChange={(e) => setNickname(e.target.value)} width="100%" />
                <div className="w-30 shrink-0">
                    <Button onClick={handleCheckNickname} isDisabled={!nickname} size="md" variant="primary">
                        중복확인
                    </Button>
                </div>
            </div>
            <div className="flex items-end gap-3">
                <Input label="이메일" errorMessage={emailError} value={email} onChange={(e) => setEmail(e.target.value)} width="100%" />
                <div className="w-30 shrink-0">
                    <Button onClick={handleCheckEmail} isDisabled={!email} size="md" variant="primary">
                        이메일 인증
                    </Button>
                </div>
            </div>
            {/* {isVerificationSent? (<div className="flex items-end gap-3">
                <Input label="인증코드" placeholder="인증코드 6자리" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                <div className="w-30">
                    <Button size="md" variant="primary" isDisabled={!verificationCode} onClick={handleVerifyCode}>인증코드 받기</Button>
                </div>
            </div>) : null} */}
            <Input label="비밀번호" errorMessage={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input label="비밀번호 확인" errorMessage={passwordConfirmError} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="w-30">
                <Button size="md" variant="primary">회원가입</Button>
            </div>
        </form>
        <p className="mt-8 text-center text-sm text-white">이미 계정이 있으신가요?</p>
        <Link href="/login" className="mt-4 text-center text-sm text-primary">로그인</Link>
    </main>);
}