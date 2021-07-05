import "./Page404.css";

function Page404(): JSX.Element {
    return (
        <div className="Page404">
            <h4>404 page not found!</h4>
			<p>
                <span></span><br /><br />
                Terribly sorry...<br />
                The page you are looking for does not exist.
            </p>

            <iframe width="560" height="315" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
            {/* A small gesture for you, Assaf Finkelshtein :) */}
        </div>
    );
}

export default Page404;