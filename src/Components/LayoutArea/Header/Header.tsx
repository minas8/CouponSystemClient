import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Logo from "../Logo/Logo";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header">
			<AuthMenu />
            <Logo />
            {/* Logo by HTML + CSS */}
            {/* <h1><span>C</span>oupon<span>system</span></h1> */}
        </div>
    );
}

export default Header;