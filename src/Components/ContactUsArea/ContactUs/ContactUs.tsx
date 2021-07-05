import { Button, ButtonGroup, Checkbox, FormControlLabel, makeStyles, TextField, Typography } from "@material-ui/core";
import { Cancel, MailOutline, Send } from "@material-ui/icons";
import "./ContactUs.css";

const useStyles = makeStyles(theme => ({
    Checkbox: {
        '&:checked': {
            backgroundColor: '#ff9c8b',
        },
        color: '#ff9c8b',
        filter: 'invert(36%) sepia(77%) saturate(1565%) hue-rotate(342deg) brightness(86%) contrast(104%)',
    },
}));

function ContactUs(): JSX.Element {

    const classes = useStyles();

    return (
        <div className="ContactUs">
            <Typography variant="h4" className="Headline"> <MailOutline /> Contact Us</Typography>

            <Typography variant="body2">
                This form is not supported.<br />
                It will not be sent by pressing the submit button.
            </Typography>
            <br />

            <TextField label="Name" variant="outlined" className="mui-input bgc-white" />
            <br /><br />

            <TextField label="Email" variant="outlined" type="email" className="mui-input bgc-white" />
            <br /><br />

            <TextField label="Message" variant="outlined" className="mui-input bgc-white"
                multiline rows="3"
            /><br />

            <FormControlLabel className="mui-input"
                label="Send me promotional emails"
                control={
                    <Checkbox color="primary" classes={{ root: classes.Checkbox }} />
                }
            /><br />

            <ButtonGroup variant="contained">
                <Button className="send" startIcon={<Send />}
                    type="button">Send</Button>
                <Button className="cancel" startIcon={<Cancel />}
                    type="reset">Cancel</Button>
            </ButtonGroup>
        </div>
    );
}

export default ContactUs;