import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Agreements from './agreements';
import {
  validateEmail, validatePhone,
  validatePassword, validateConfirmPassword,
  validateUsername,
  validateReferralUsername
} from '../../utils/validation';
import { User } from '../../types/user.type';
import { FormData, Validations } from '../../types/form.type';

const normalizePhone = (phone: string) => {
  return phone.replace(/[^0-9]/g, '');
};

const SignUpForm = ({ users, handleSignup }: { users: User[], handleSignup: (user: User) => void }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    username: '',
    referralUsername: '',
    isAllAgree: false,
    isTermsAgree: false,
    isPrivacyAgree: false,
    isMarketingAgree: false,
  });

  const [isValid, setIsValid] = useState<Validations>({
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    username: false,
    referralUsername: false,
    isTermsAgree: false,
    isPrivacyAgree: false,
  });



  const [showAllMessage, setShowAllMessage] = useState(false);

  const validateEveryField = () => {
    setIsValid({
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      phone: validatePhone(formData.phone),
      username: validateUsername(formData.username),
      referralUsername: (formData.referralUsername === '') ? true : validateReferralUsername(formData.referralUsername),
      isTermsAgree: formData.isTermsAgree,
      isPrivacyAgree: formData.isPrivacyAgree,
    });

    console.table(isValid);
    return Object.values(isValid).every(v => v === true);
  }

  const navigate = useNavigate();

  const getReferralUserId = (username: string) => {
    const user = users.find(user => user.username === username);
    return user ? user.id : null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAllMessage(true);
    if (validateEveryField()) {
      console.log('submit');
      const user: User = {
        id: users.length + 1,
        email: formData.email,
        phone: normalizePhone(formData.phone),
        username: formData.username,
        referralUserId: getReferralUserId(formData.referralUsername),
        isTermsAgree: formData.isTermsAgree,
        isPrivacyAgree: formData.isPrivacyAgree,
        isMarketingAgree: formData.isMarketingAgree,
        createdAt: new Date(),
      };
      handleSignup(user);
      navigate('/signup-result', { state: { user }, replace: true });
    } else {
      console.log('invalid');
    }
    console.table(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend className="form-title">회원가입</legend>
        <Input
          name='email'
          label='이메일'
          type='email'
          value={formData.email}
          setValue={(value) => setFormData({ ...formData, email: value })}
          isValid={isValid.email}
          setIsValid={(valid) => setIsValid({ ...isValid, email: valid })}
          validation={validateEmail}
          validationMessage={{
            required: '이메일을 입력해주세요.',
            format: '올바른 이메일 형식이 아닙니다.',
            duplicated: '이미 사용중인 이메일입니다.'
          }}
          showMessage={showAllMessage}
          isRequired
        />
        <Input
          name='phone'
          label='전화번호'
          type='tel'
          value={formData.phone}
          setValue={(value) => setFormData({ ...formData, phone: value })}
          isValid={isValid.phone}
          setIsValid={(valid) => setIsValid({ ...isValid, phone: valid })}
          validation={validatePhone}
          validationMessage={{
            required: '전화번호를 입력해주세요.',
            format: '올바른 전화번호 형식이 아닙니다.',
            duplicated: '이미 사용중인 전화번호입니다.'
          }}
          helpMessage='예) 01012345678'
          showMessage={showAllMessage}
          isRequired
        />
        <Input
          name='password'
          label='비밀번호'
          type='password'
          value={formData.password}
          setValue={(value) => setFormData({ ...formData, password: value })}
          isValid={isValid.password}
          setIsValid={(valid) => setIsValid({ ...isValid, password: valid })}
          validation={validatePassword}
          validationMessage={{
            required: '비밀번호를 입력해주세요.',
            format: '영문/숫자/특수문자를 모두 포함하여 8자 이상으로 입력해주세요.',
          }}
          showMessage={showAllMessage}
          isRequired
          helpMessage='영문/숫자/특수문자 모두 포함, 8자 이상'
          autoComplete= 'off'
        />
        <Input
          name='confirmPassword'
          label='비밀번호 확인'
          type='password'
          value={formData.confirmPassword}
          setValue={(value) => setFormData({ ...formData, confirmPassword: value })}
          isValid={isValid.confirmPassword}
          setIsValid={(valid) => setIsValid({ ...isValid, confirmPassword: valid })}
          validation={() => validateConfirmPassword(formData.password, formData.confirmPassword)}
          validationMessage={{
            required: '비밀번호를 입력해주세요.',
            format: '비밀번호가 일치하지 않습니다.',
          }}
          showMessage={showAllMessage}
          isRequired
          autoComplete= 'off'
        />
        <Input
          name='username'
          label='사용자명'
          type='text'
          value={formData.username}
          setValue={(value) => setFormData({ ...formData, username: value })}
          isValid={isValid.username}
          setIsValid={(valid) => setIsValid({ ...isValid, username: valid })}
          validation={validateUsername}
          validationMessage={{
            required: '사용자명을 입력해주세요.',
            format: '영문/숫자만 사용하여 3자 이상 15자 이하로 입력해주세요.',
            duplicated: '이미 사용중인 사용자명입니다.'
          }}
          showMessage={showAllMessage}
          helpMessage='영문/숫자만 사용 가능, 3자 이상 15자 이하'
          isRequired
        />
        <Input
          name='referralUsername'
          label='추천인 사용자명'
          type='text'
          value={formData.referralUsername}
          setValue={(value) => setFormData({ ...formData, referralUsername: value })}
          isValid={isValid.referralUsername}
          setIsValid={(valid) => setIsValid({ ...isValid, referralUsername: valid })}
          validation={validateReferralUsername}
          validationMessage={{
            format: '존재하지 않는 추천자명입니다.',
          }}
          showMessage={showAllMessage}
        />
        <Agreements
          formData={formData}
          setFormData={setFormData}
          isValid={isValid}
          setIsValid={setIsValid}
          showMessage={showAllMessage}
        />
        <div className='button-wrapper'>
          <button type='submit'>
            가입하기
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default SignUpForm;
