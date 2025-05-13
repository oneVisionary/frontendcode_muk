import { SvgIcon, SvgIconProps } from '@mui/material';

const LogoutIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fill="current" {...props}>
      <path
        d="M14 2H10C8.34 2 7 3.34 7 5V19C7 20.66 8.34 22 10 22H14C15.66 22 17 20.66 17 19V17H15V19C15 19.55 14.55 20 14 20H10C9.45 20 9 19.55 9 19V5C9 4.45 9.45 4 10 4H14C14.55 4 15 4.45 15 5V7H17V5C17 3.34 15.66 2 14 2Z"
        fill="current"
      />
      <path
        d="M19 12L16 9V11H10V13H16V15L19 12Z"
        fill="current"
      />
    </SvgIcon>
  );
};

export default LogoutIcon;
