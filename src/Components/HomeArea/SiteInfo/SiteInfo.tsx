import "./SiteInfo.css";

function SiteInfo(): JSX.Element {
    return (
        <div className="SiteInfo">
            <h4>Welcome to</h4>
			<h2>Coupons System</h2>
            <p>
                When logged in as an <span>Administrator</span> you will be able to 
                create, update, delete and view companies and customers.
            </p>
            <p>
                When logged in as a <span>Company</span> you will be able to 
                create, update, delete and view coupons.
            </p>
            <p>
                When logged in as a <span>Customer</span> you will be able to 
                purchase and view coupons.
            </p>
            <h4>in a <span>simple</span> and <span>easy</span> way.</h4>
        </div>
    );
}

export default SiteInfo;