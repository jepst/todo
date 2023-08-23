import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';

import {setState, getState} from './db';
import {TrashIcon} from './icons';

function App() {

  // store the username
  const [username, setUsername] = React.useState(null);

  // store the list as strings
  const [thelist, setThelist] = React.useState(null);

  // enable prompt for new item
  const [prompt, setPrompt] = React.useState(false);

  const usernameRef = React.useRef(null);
  const itemRef = React.useRef(null);

  /*
    Reach data from server when username
    is entered;
  */
  React.useEffect(() => {
    if (username === null) {
        setThelist(null);
    } else {
        getState(username, (result) => {
            setThelist(result);
            if (result === null)
                setUsername(null);
        });
    }
  }, [username]);


  /*
    Write data to server when list changes
  */
  React.useEffect(() => {
    if (username !== null) {
        setState(username, thelist);    
    }
  }, [thelist, username]);


  /*
    UI for login
  */
  const nameEntry = <Stack>
        <TextField defaultValue=""
                   label="Username" inputRef={usernameRef}/>
        <ButtonGroup variant="contained">
           <Button onClick={() => setUsername(usernameRef.current.value)}>Login</Button>
        </ButtonGroup>
    </Stack>;

  /*
    UI for the actual list
  */
  const listViewer = <Stack>
        { prompt 
           ?
             <>
                <TextField defaultValue=""
                   label="To-do item" inputRef={itemRef}/>
                    <ButtonGroup variant="contained">
                        <Button onClick={() => 
                            {
                                const newitem = itemRef.current.value;
                                if (newitem.trim()) {
                                    setThelist([...(thelist??[]), newitem]);
                                }
                                setPrompt(false);
                            }}>Submit</Button>
                    </ButtonGroup>                
             </>

           : 
            <>
                <ButtonGroup variant="contained">
                   <Button onClick={() => setPrompt(true)}>+</Button>
                </ButtonGroup>

                 <List>
                   {(thelist??[]).length ? thelist.map((item) =>
                            <ListItem key={item} 
                               secondaryAction={<IconButton onClick={() => setThelist(thelist.filter((i)=>i!==item))} edge="end"><TrashIcon/></IconButton>}>
                               {item}
                           </ListItem>)
                         : <div>Your list is empty</div>}
                 </List>
             </>
        }
    </Stack>;

  return (
    <>
        <CssBaseline/>
        <Grid container space={0} direction="column"
              alignItems="center" justifyContent="center"
               sx={{ minHeight: '100vh' }}>
            <Grid item xs={3}>
                <Card>  
                    <CardHeader title={username ? `To-Do List for ${username}` : "To-Do List"}/>
                        { username === null 
                            ? nameEntry
                            : listViewer
                        }
                </Card>
            </Grid>
        </Grid>
    </>
  );
}

export default App;
