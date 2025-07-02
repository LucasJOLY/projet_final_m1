import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { IoCopyOutline } from 'react-icons/io5';
import { IconButton } from '@mui/material';
import { getIntl } from '../language/config/translation';

export const CopyButtonIcon = ({ text }: { text: string }) => {
  const intl = useIntl();
  const copyTextToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(intl.formatMessage({ id: 'common.copiedToClipboard' }));
  };
  return (
    <IconButton onClick={() => copyTextToClipboard(text)}>
      <IoCopyOutline size={16} />
    </IconButton>
  );
};

export const getErrorValidationMessage = (errors: any) => {
  const locale = localStorage.getItem('locale') || 'fr';
  const intl = getIntl(locale);
  if (!errors || typeof errors !== 'object') return false;

  Object.keys(errors).forEach((field) => {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach((errorKey: string) => {
        const translatedMessage = intl.formatMessage({ id: errorKey });
        toast.error(translatedMessage);
      });
    }
  });
  return true;
};
