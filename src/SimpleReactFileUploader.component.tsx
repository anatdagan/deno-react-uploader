import {React, ReactDOMServer} from './deps.ts'

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
    this.fileUpload(this.state.file)
  }
  onChange(e: any) {
    this.setState({file:e.target?.files[0]})
  }
  async fileUpload(file: File){
    console.log('file upload')
    const url = 'upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    const res = await fetch('/upload', { //Fetch API automatically puts the form in the format "multipart/form-data".
	    method: 'POST',
	    body: formData,
    }).then(response=>response.status);
    const msg = (res===200)? 'Successfully uploaded' : 'Upload failed'
    this.setState({msg:"   " + msg});
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