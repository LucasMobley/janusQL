import React, { useReducer, useEffect, Component } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import React from "react";

//comment back in when impementing react router
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link, 
  useRouteMatch,
  useParams
} from "react-router-dom";



import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { red, grey } from '@material-ui/core/colors';



//css styles here
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    // added sign up button
    signUp: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: 'linear-gradient(45deg, #FE688B 30%, #FF8E53 90%)',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

//state type and initial state
type State = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean,
  loginRedirect: boolean
};

const initialState:State = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false,
  loginRedirect: false,
};

//action types
type Action = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'loginRedirect', payload: boolean}
  | { type: 'setIsError', payload: boolean };

  //reducers
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUsername': 
      return {
        ...state,
        username: action.payload
      };
      case 'loginRedirect': 
      return {
        ...state,
        loginRedirect: action.payload
      };
    case 'setPassword': 
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
  }
}

//methods
const Login = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.trim() && state.password.trim()) {
     dispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.username, state.password]);  //username and password dispatched to state?

  const handleLogin = () => {
    const { username, password } = state; 
    const credentials = { username, password }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials) // do we even need to stringify this?
    }

    console.log("hath we arrived?");
    fetch('http://localhost:3000/user/login', options)
    //we need access to the status code on result object
    .then(result => result.json())
    .then(result => {
      console.log("all is still well in the React world")
      if(result[0].username && result[0].password) {
        console.log("conditional checks out")
        dispatch({
          type: 'loginRedirect',
          payload: true
        })
      } else {
        dispatch({
          type: 'loginFailed',
          payload: 'login credentials not found'
        })
      }
    })
    .catch(err => console.log("error in front on DB credential check", err))
     
  };

//this needs attention - depricated
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }

  //logic for re-routing on successful login
  const { loginRedirect } = state;
  if(loginRedirect) {
    return <Redirect to='/Graphs' />
  }

  return (

    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Login to JanusQL" />
        <CardContent>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="username"
              type="email"
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
        <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            onClick={handleLogin}
            disabled={state.isButtonDisabled}>
            Register
          </Button>   
        </CardActions>
        </Card>

      <Button>
      <Link color="primary" to="/Signup">Signup</Link>
    </Button>
    </form>
  );
}

export default Login;