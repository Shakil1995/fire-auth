import logo from './logo.svg';
import './App.css';

import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [newUser ,setNewUser]=useState(false);
  const [user,setUser]=useState({

    isSignedIn:false,
    newUser:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success:''
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  var fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn= ()=>{
console.log('sign In clicked');
firebase.auth().signInWithPopup(provider)
.then(result => {
  const {displayName,photoURL,email} = result.user;
 const signedInUser={
   isSignedIn:true,
   name:displayName,
   email:email,
   photoURL:photoURL
 }
setUser(signedInUser);
  console.log(displayName,email,photoURL);
}).catch(err => {
  console.log(err);
  console.log(err.message);
})
  }

const handleSignOut = () => {
  firebase.auth().signOut()
  .then(result => {
    const signOutUser={
      isSignedIn:false,
      name:'',
      email:'',
      photoURL:''
    }
    setUser(signOutUser);
  })
  .catch(err => {
 console.log(err);
  console.log(err.message);
  })
  console.log('sign out');
}


const handleFbSignIn=() => {
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log( 'fb user ',user);

  
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
}

// const handleChange= (event) => {
//   // console.log(event.name);
//   console.log(event.target.name,event.target.value);
// }

const handleBlur= (event) => {
  // debugger;
  // console.log(event.name);
  // console.log(event.target.name,event.target.value);
  let isFormValid = true;

  if(event.target.name ==='email'){
    isFormValid =/\S+@\S+\.\S+/.test(event.target.value);
           
            // console.log(isEmailValid);
  }
  if(event.target.name ==='password'){
      const isPasswordValid = event.target.value.length>6;
      const isPasswordNumberValid =/\d{1}/.test(event.target.value);
      isFormValid=isPasswordValid && isPasswordNumberValid;

    }
   if(isFormValid){
    const newUserInfo ={...user};
    newUserInfo[event.target.name]=event.target.value;
    setUser(newUserInfo);
  }

}

const handleSubmit = (event) => {
  console.log(user);
if(newUser && user.email && user.password){
  // console.log('submitting ');
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in 
    const newUserInfo ={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    // setUser(newUserInfo);
    updateUserName(user.name);
   
  })
  .catch((error) => {
    
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
  
  });
}

if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo={...user}
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    console.log('sign is youer ' ,res.user);
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
  });

}
event.preventDefault();

}

const updateUserName = name => {
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName:name,
 
}).then(function() {
  // Update successful.
  console.log('Update successful');
}).catch(()=> {
  console.log('Update successful');
});

}

  return (
    <div className="App">
    
  {
    user.isSignedIn  ? <button  onClick={handleSignOut} > Sign Out </button> :  
    <button  onClick={handleSignIn} > Sign in </button>
     }
<br/>
             <button onClick={handleFbSignIn} >Sing In facebook</button>

    {
      user.isSignedIn && 
      <div>
      <p>Welcome, {user.name}</p> 
      <p>Email : {user.email}</p> 
      <img src={user.photoURL} alt=""/>
    </div>
    }
      <h1>Our own Authentication</h1>

      <input type="checkbox"  onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser"> New User Sign Up</label>
        {/* <p>name :{user.name} </p>
      <p> Email : {user.email}</p>
      <p>password : {user.password}</p> */}
     <form action="" onSubmit={handleSubmit}>

      { newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Your Name "/> } <br/>
     {/* <input onChange={handleChange} name="email" type="text" placeholder="enter your Email address" required/> */}
     <input onBlur={handleBlur} name="email" type="text" placeholder="enter your Email address" required/>

      <br/>
      {/* <input  onChange={handleChange} name="password" type="password" placeholder="enter your password address" required /> */}
      <input  onBlur={handleBlur} name="password" type="password" placeholder="enter your password address" required />
<br/>
<input type="submit" value={newUser? 'Sign Up' : 'Sign In'}/>

<p style={{ color:'red' }} > {user.error}</p>
{ user.success &&  <p style={{ color:'green' }} > User {newUser ? 'created' : 'Logged In '} successFully</p> }

</form>

    </div>
  );
}

export default App;
