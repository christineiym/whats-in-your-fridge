import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import React, { useEffect } from 'react';
import { addToList, getUserList, removeFromList } from '../services/UserInfo';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(0, 0, 2),
    },
    addItem: {
        marginBottom: "10px",

    }
}));

export default function InteractiveList(props) {
    const classes = useStyles();
    const [foods, setFoods] = React.useState([]);
    const [foodItem, setFoodItem] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        addFood(foodItem);
        setOpen(false);
    }

    const retrieve = () => {
        getUserList(props.user.googleId).then(data => {
            setFoods(data["food"]);
        })
    }

    useEffect(() => retrieve(), []);

    const addFood = (value) => {
        addToList(props.user.googleId, value).then(data => setFoods(data["food"]));
    }
    const deleteFood = (value) => {
        removeFromList(props.user.googleId, value).then(data => setFoods(data["food"]));
    };

    const onFileChange = event => { 
        setSelectedFile(event.target.files[0]);
    }; 

    const onFileUpload = () => {

        const formData = new FormData();

        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );

        console.log(selectedFile);
        console.log(formData);

        // axios.post("api/uploadfile", formData);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
                What's in {props.user.givenName}'s fridge:
          </Typography>

            <div className={classes.demo}>
                <List dense={false}>
                    <Button className={classes.addItem} variant="outlined" color="primary" onClick={handleClickOpen}>
                        Add new item
                    </Button>
                    <input type="file" onChange={onFileChange} accept="image/*" />
                    <Button onClick={onFileUpload}>Upload</Button>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">New Item</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please enter your food item
                       </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="item"
                                label="Food Item"
                                type="text"
                                value={foodItem}
                                onInput={e => setFoodItem(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                       </Button>
                            <Button onClick={handleSubmit} color="primary">
                                Add
                       </Button>
                        </DialogActions>
                    </Dialog>
                    {foods && foods.map((val) => (
                        <>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={val}
                                //secondary={secondary ? 'Secondary text' : null}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => deleteFood(val)} >

                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </>
                    ))}
                </List>

            </div>

        </div>
    );


}
