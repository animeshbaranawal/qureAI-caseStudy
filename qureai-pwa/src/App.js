import React from 'react';
import UploadFileService from './services/uploadfiles';
import "./App.css"

function stringToHash(string) {
  let hash = 0;
  if (string.length === 0) return hash;
    let i;
    for (i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
  return (hash + 2147483648) % 2147481648;
}

class ImageUpload extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      imageFile: null,
      imageSize: 0,
      requestHash: null,
      disableBrowse: false,
      disableUpload: true,
      progress: 0,

      image: null,
      imageName: "",
      top5: [0,0,0,0,0],
      top5Categories: ["","","","",""],
      inferenceStatus: 0,
    };
  }
  
  handleClick(e) {
    if(e.target.files && e.target.files[0]) {
      let hash = stringToHash(e.target.files[0].name+Date.now());
      let fileSize = ((e.target.files[0].size / 1024)/1024).toFixed(4);
      let imageObject = URL.createObjectURL(e.target.files[0]);
      this.setState({
        imageFile: e.target.files[0], 
        imageSize: fileSize,
        requestHash: hash,
        disableUpload: fileSize >= 4,
        disableBrowse: false,
        progress: 0,

        image: imageObject,
        imageName: e.target.files[0].name,
        inferenceStatus: 0,
        top5: [0,0,0,0,0],
        top5Categories: ["","","","",""],
      });
    }
  }

  upload() {
    let hash = this.state.requestHash;
    if(!(hash === null)) {
      this.setState({disableBrowse:true, disableUpload:true,});

      UploadFileService.upload(this.state.imageFile, hash, (event) => {
      this.setState({progress: Math.round((100 * event.loaded) / event.total)});
      })
      .then(() => this.infer())
      .catch(err => this.failUpload(err));
    };
  }

  failUpload(err) {
    console.log(err);
    this.setState({
      imageFile: null, 
      imageSize: 0,
      requestHash: null,
      disableUpload: true,
      disableBrowse: false,
      progress: 0,
    });
  }

  infer() {
    this.setState({
      disableUpload: true,
      disableBrowse: false,
      progress: 0,
    });

    let hash = this.state.requestHash;
    if(!(hash === null)) {
      UploadFileService.getInference(hash)
      .then((res) => this.display(res.data))
      .catch(err => this.failInfer(err));
    };
  }

  failInfer(err) {
    console.log(err);
    this.setState({
      imageFile: null, 
      imageSize: 0,
      requestHash: null,

      inferenceStatus: -1,
    });
  }

  display(data) {
    if(("inference" in data) && (data["inference"].length === 5)) {
      let infArray = data["inference"];
      this.setState({top5Categories: [infArray[0][0],infArray[1][0],infArray[2][0],
                                infArray[3][0],infArray[4][0]],
                    top5: [Math.round(infArray[0][1]),Math.round(infArray[1][1]),
                            Math.round(infArray[2][1]),Math.round(infArray[3][1]),
                            Math.round(infArray[4][1])],
                    inferenceStatus: 1,
      });
    } else {
      this.setState({inferenceStatus: -1,})
    }

    this.setState({
      imageFile: null, 
      imageSize: 0,
      requestHash: null,
    });
  }

  render(){
    let fileInvalidString;
    if(this.state.requestHash === null) {
      fileInvalidString="Click on Browse to select picture";
    } else if(this.state.imageSize >= 4) {
      fileInvalidString="File size >= 4MB";
    } else {
      fileInvalidString="Click on Upload to perform inference";
    }

    let widths = [0,0,0,0,0];
    let i;
    for(i=0; i<5; i++) {
      widths[i] = 3*this.state.top5[i];
    }

    let inferenceSuccess;
    if(this.state.inferenceStatus === 0) inferenceSuccess = "Inference Pending";
    else if(this.state.inferenceStatus === 1) inferenceSuccess = "Inference Done";
    else if(this.state.inferenceStatus === -1) inferenceSuccess = "Inference Failed";

    return (
      <div className="ImageUpload">
        <div className="upload-btn-wrapper">
          <button className="btn" disabled={this.state.disableBrowse}>Browse</button>
          <input type="file" name="my file" accept="image/*"
                 onChange={(e) => this.handleClick(e)} />
        </div>
        <br/>
        <button className="btn"
                  disabled={this.state.disableUpload}
                  onClick={() => this.upload()}
        > Upload </button>
        <br/>
        <progress value={this.state.progress} max="100" style={{width:360}} />
        <h4>{fileInvalidString}</h4>

        <div className="ImageInfer">
          <img src={this.state.image} alt={this.state.imageName} width="360" height="360" />
          <h4>{inferenceSuccess}</h4>
          <table>
            <tbody>
              <tr>
                <td style={{width:50}}>{this.state.top5Categories[0]}</td>
                <td style={{width:300}}><div style={{backgroundColor:"red", color:"white", width:widths[0]}}>{this.state.top5[0]}</div></td>
              </tr>
              <tr>
                <td style={{width:50}}>{this.state.top5Categories[1]}</td>
                <td style={{width:300}}><div style={{backgroundColor:"red", color:"white", width:widths[1]}}>{this.state.top5[1]}</div></td>
              </tr>
              <tr>
                <td style={{width:50}}>{this.state.top5Categories[2]}</td>
                <td style={{width:300}}><div style={{backgroundColor:"red", color:"white", width:widths[2]}}>{this.state.top5[2]}</div></td>
              </tr>
              <tr>
                <td style={{width:50}}>{this.state.top5Categories[3]}</td>
                <td style={{width:300}}><div style={{backgroundColor:"red", color:"white", width:widths[3]}}>{this.state.top5[3]}</div></td>
              </tr>
              <tr>
                <td style={{width:50}}>{this.state.top5Categories[4]}</td>
                <td style={{width:300}}><div style={{backgroundColor:"red", color:"white", width:widths[4]}}>{this.state.top5[4]}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ImageUpload;