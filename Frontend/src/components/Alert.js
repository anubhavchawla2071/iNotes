import React from "react";

export default function Alert(props) {
  console.log(props.alert);
  const capitalise=(word)=>{
    if(word==="danger"){
      word="error"; 
    }
    return word;
  }
  return (
    <div style={{height:'0px',width:'100%'}}>
       { props.alert &&<div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
        <strong>{capitalise(props.alert.type)}</strong>  : {props.alert.msg}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => props.setAlert({})}>
        </button>
      </div>
       }
    </div>
  );
}