import { Button, Dialog, DialogActions, DialogTitle, makeStyles, Typography } from "@material-ui/core";
import { CancelOutlined, DeleteOutlined } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2)
    },
    secondary: {
        color: '#1a1a1a',
        border: '2px solid #1a1a1a',
        backgroundColor: '#dbdbdb',
        '&:hover': {
            color: '#dbdbdb',
            backgroundColor: '#1a1a1a'
        }
    },
    primary: {
        color: '#e04226',
        border: '2px solid #e04226',
        backgroundColor: '#ffede9',
        '&:hover': { 
            color: '#ffede9',
            backgroundColor: '#e04226' 
        }
    }
}));

interface SimpleDialogProps {
    open: boolean;
	selectedValue: string;
    onClose: (value: string) => void;
    title: string;
}

function SimpleDialog(props: SimpleDialogProps): JSX.Element {

    const {open, selectedValue, onClose, title} = props;
    const classes = useStyles();

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleButtonClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </DialogTitle>
            <DialogActions>
                <Button classes={{ root: classes.primary }}
                    startIcon={<DeleteOutlined />} 
                    onClick={() => handleButtonClick("delete")}>
                        Delete
                </Button>
                <Button classes={{ root: classes.secondary }}
                    startIcon={<CancelOutlined />} 
                    onClick={() => handleButtonClick("cancel")}>
                        Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SimpleDialog;