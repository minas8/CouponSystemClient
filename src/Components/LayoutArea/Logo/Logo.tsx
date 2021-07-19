import "./Logo.css";
import logoImage from "../../../Assets/images/logo.png";

function Logo(): JSX.Element {
    return (
        <div className="Logo">
            <img src={logoImage} />
        </div>
    );
}

export default Logo;
