import { Typography } from "@material-ui/core";
import { Face, GitHub, LinkedIn } from "@material-ui/icons";
import "./AboutUs.css";

function AboutUs(): JSX.Element {
    return (
        <div className="AboutUs">
            <Typography variant="h4" className="Headline"> <Face /> About Me</Typography>

            <br />
            <div className="info">
                <Typography variant="body2">
                    My name is Mina Shtraicher.<br />
                    You can find me here:
                </Typography>
                <Typography variant="h4">
                    <a href="https://github.com/minas8" target="_blank" rel="noreferrer" title="My GitHub">
                        <GitHub />
                    </a>
                    <a href="https://www.linkedin.com/in/mina-shtraicher" target="_blank" rel="noreferrer" title="My LinkedIn">
                        <LinkedIn />
                    </a>
                </Typography>

                <Typography variant="overline" className="TextField">Objective</Typography>
                <Typography variant="body2">
                    I have about 10 years of experience as a software engineer (post career change), specializing in C# and familiar with both
                    client &amp; server side.<br /> I took part in many projects, which required working with various interfaces &amp; team
                    members.<br /> On March 2020 I was put on a long LOA and decided to invest my time in expanding my technical
                    skills and focus on new professional areas.<br />
                    These days I’m actively searching for my next position as a Java Full Stack / Microsoft.Net developer.
                </Typography>
                <br />

                <Typography variant="overline" className="TextField">Professional Experience</Typography>
                <br />
                <Typography variant="caption" className="TextField">2011 – 2020 Software developer, One1 (Advantech)</Typography>
                <ul>
                    <li>Develop &amp; implement ClickSoftware solutions based on client’s requirements</li>
                    <li>Build Web Services / WCF solutions, using .NET technology &amp; developing in C#</li>
                    <li>Implementing MSP (My Single Point) in JavaScript</li>
                    <li>Using diverse technologies on a daily basis: C#, WinForms, MSSQL, Web Services, XML, Javascript, jQuery, HTML,CSS</li>
                    <li>Response on bids</li>
                    <li>Working on diverse projects which required much self learning, for example the Services of Google maps api and implementing stand-alone development for clients</li>
                    <li>Working in a team of 3 while collaborating, knowledge sharing &amp; training new employees</li>
                    <li>Selected for outstanding employee – 2017</li>
                </ul>

                <Typography variant="caption" className="TextField">2011 Software developer, Find Me An Angel (FMAA) inc</Typography>
                <ul>
                    <li>Developing a complex social website</li>
                    <li>Building a web product, while using ASP.NET Web Forms</li>
                    <li>Developing in .Net, C# and working with MSSQL database</li>
                </ul>
            </div><br /><br />
        </div>
    );
}

export default AboutUs;
