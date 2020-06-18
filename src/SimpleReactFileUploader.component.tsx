import {React, ReactDOMServer} from './deps.ts'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      form: any;
      input: any;
      button: any;
      h1: any;
    }
  }
}

class SimpleReactFileUpload extends (React as any).Component {

  constructor(props:any) {
    super(props);
    this.state ={
      file:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e: Event){
    console.log('form submit')
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response:any)=>{
      console.log(response.data);
    })
  }
  onChange(e: any) {
    this.setState({file:e.target?.files[0]})
  }
  fileUpload(file: File){
    console.log('file upload')
    const url = 'upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  fetch(url, {method:'post', body:formData}).then(()=>console.log('posted'))
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
   )
  }
}



export default SimpleReactFileUpload