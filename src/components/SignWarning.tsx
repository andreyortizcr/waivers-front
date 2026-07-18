import '../styles/SignWarning.css'
import { useTranslation } from 'react-i18next'

export const SignWarning = () => {

    const { t } = useTranslation()

    return <div className="sign-warning">
        {t("form.signWarning")}
    </div>
}