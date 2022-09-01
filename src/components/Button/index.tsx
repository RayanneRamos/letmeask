import { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import { useTheme } from '../../hooks/useTheme';
import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isLogout?: boolean;
  isDanger?: boolean;
}

function Button({ isOutlined = false, isLogout = false, isDanger = false, ...props }: ButtonProps) {
  const theme = useTheme();

  return (
    <button 
      className={cx(`button ${theme}`, { outlined: isOutlined }, { logout: isLogout }, { danger: isDanger })}
      {...props}
    />
  );
}

export { Button };