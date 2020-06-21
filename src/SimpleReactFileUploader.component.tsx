import {React} from './deps.ts'
//declaring an interface for JSX intrinsic elements (DOM elements)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      form: any;
      input: any;
      button: any;
      h1: any;
      span: any;
    }
  }
}

/**
 * A component for uploading files
 */
class SimpleReactFileUpload extends (React as any).Component {

  constructor(props:any) {
    super(props);
    this.state ={
      file:null,
      msg:''
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e: Event){
    console.log('form submit')
    e.preventDefault() // Stop form submit
    if (this.state.file)
      this.fileUpload(this.state.file)
    else 
      this.setState({msg:" Upload failed"});
  }
  onChange(e: any) {
    //store file in state, and remove sucess/failure indication
    this.setState({file:e.target?.files[0], msg:''})
  }
  async fileUpload(file: File){
    console.log('file upload')
    const formData = new FormData();
    formData.append('file',file)
    fetch('/upload', { //Fetch API automatically puts the form in the format "multipart/form-data".
	    method: 'POST',
	    body: formData,
    }).then(response=>{
      const msg = (response.status===200)? 'Successfully uploaded' : 'Upload failed'
      //store success/failure indication in state
      this.setState({msg:"   " + msg});
    }).catch((reason)=>{
      console.log("Upload failed", reason)
      this.setState({msg:"  Upload failed"});
    })
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button> 
        <span id='msg'>{this.state.msg}</span>
      </form>
   )
  }
}



export default SimpleReactFileUpload