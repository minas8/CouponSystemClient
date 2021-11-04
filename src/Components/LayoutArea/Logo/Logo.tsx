import "./Logo.css";
import logoImage from "../../../Assets/images/logo.png";

function Logo(): JSX.Element {
    return (
        <div className="Logo">
            <img src={logoImage} alt="Coupons system logo" />
        </div>
    );
}

export default Logo;
