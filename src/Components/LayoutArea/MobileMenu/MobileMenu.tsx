import { CloseRounded, MenuOutlined } from "@material-ui/icons";
import { useState } from "react";
import Menu from "../Menu/Menu";
import "./MobileMenu.css";

function MobileMenu(): JSX.Element {
    const [isShown, setIsShown] = useState(false);
    
    const handleClickShown = () => {
        setIsShown(true);
    }

    const handleClose = () => {
        setIsShown(false);
    }

    return (
        <div className="MobileMenu">
            {/* hamburger icon shows the menu on click */}
            <MenuOutlined className="hamburger" onClick={handleClickShown} />

            <div className={isShown ? "menu-dark-bg fade-in" : "menu-dark-bg fade-out"}>
                <div className={isShown ? "mobile-menu" : "mobile-menu hidden"}>
                    <CloseRounded className="close-menu" onClick={handleClose} />
                    <Menu closeMobileMenu={handleClose}/>
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;