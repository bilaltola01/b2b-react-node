import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import getCroppedImg from './Image/cropImage'

import BranchImageEdit from "./BranchImageEdit";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

let createHandlers = ctx => {
  let handleSubmit = (e, props) => {
    if (props.onUploadSubmit) {
      props.onUploadSubmit({
        file: ctx.state.file,
        url: ctx.state.imagePreviewUrl
      });
    }

    if (props.onChanges) {
      props.onChanges("images", { data: ctx.state.allImages });
    }
  };

  let handleImageChange = async (e, props) => {
    e.preventDefault();
    const file = e.target.files[0];
    const maxSizeMB = 1;
    const maxWidthOrHeight = 1024; // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight

    try {
      const compressedFile = await imageCompression(
        file,
        maxSizeMB,
        maxWidthOrHeight
      );
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      let reader = new FileReader();
      await new Promise(resolve => {
        reader.onloadend = () => {
          ctx.setState(prevState => {
            let nextID = Math.floor(
              new Date().getTime() * 1000 + Math.random() * 10000
            );

            let images = prevState.allImages;
            images.push({
              id: nextID,
              imgPath: reader.result,
              newlyAdded: true,
              file: file,
              caption: ""
            });

            return {
              file: file,
              imagePreviewUrl: reader.result,
              allImages: images,
              modalIsOpen: true
            };
          });

          handleSubmit(e, props);
          resolve();
        };
        reader.readAsDataURL(compressedFile);
      });

      handleSubmit(e, props);
    } catch (error) {
      console.log(error);
    }
  };

  let handleImageChangeOutside = obj => {
    ctx.setState(prevState => {
      let images = prevState.allImages;

      images.push(obj)
      // console.log(prevState.allImages);

      // console.log(images);
      ctx.props.onChanges("images", { data: images });
      return {
        allImages: images
      };
    });
  };

  let onImageRemove = obj => {
    ctx.setState(prevState => {
      let images = prevState.allImages.reduce((acc, current) => {
        return current.id !== obj.id ? acc.concat([current]) : acc;
      }, []);

      // console.log(prevState.allImages);

      // console.log(images);
      ctx.props.onChanges("images", { data: images });
      return {
        allImages: images
      };
    });
  };

  let confirmRemove = obj => {};

  return {
    handleSubmit,
    handleImageChange,
    confirmRemove,
    onImageRemove,
    handleImageChangeOutside
  };
};

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      showRemoveConfirm: true,
      imagePreviewUrl: "",
      allImages: props.images,
      modalIsOpen: false,
      crop: { x: 0, y: 0 },
      zoom: 1,
    };
    this.handlers = createHandlers(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onZoomChange = this.onZoomChange.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.allImages.length !== nextState.allImages.length ||
      this.state.imagePreviewUrl !== nextState.imagePreviewUrl ||
      this.state.showRemoveConfirm !== nextState.showRemoveConfirm ||
      this.state.zoom !== nextState.zoom ||
      this.state.crop !== nextState.crop
    );
  }

  closeModal() {
      this.setState({modalIsOpen: false});
  }
  onCropChange(crop) {
      this.setState({ crop })
  }

  onCropComplete(croppedArea, croppedAreaPixels) {
      // console.log(croppedArea, croppedAreaPixels)
      this.setState({ croppedAreaPixels})
  }

  onZoomChange(zoom) {
      this.setState({ zoom })
  }

  async handleCrop() {
    const { allImages } = this.state
    const croppedImage = await getCroppedImg(allImages && allImages[0] && allImages[0].imgPath, this.state.croppedAreaPixels)
    let nextID = Math.floor(
        new Date().getTime() * 1000 + Math.random() * 10000
    );
    const images = [{
      id: nextID,
      altDesc: '',
      imgPath: croppedImage,
      newlyAdded: true,
      caption: ''
    }]
    const file = {
        lastModified: new Date(),
        lastModifiedDate: new Date(),
        name: 'logo.png',
        size: 1000,
        type: 'image/png'
    }
    this.setState({ allImages: images, modalIsOpen: false, crop: { x: 0, y: 0 }, zoom: 1, imagePreviewUrl: croppedImage}, () => {
        this.props.onChanges("images", { data: images });
        if (this.props.onUploadSubmit) {
            this.props.onUploadSubmit({
                file: this.state.file,
                url: this.state.imagePreviewUrl
            });
        }
    })

    this.closeModal();
  }

  renderPopup() {
    const { crop, zoom, allImages } = this.state;

    return (
        <Modal
            isOpen={this.state.modalIsOpen}
            // onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
          <div style={{position: 'relative'}}>
            <div className="crop-container" style={{width: 400, height: 400, display: 'block'}}>
              <Cropper
                  // image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                  image={allImages && allImages[0] && allImages[0].imgPath}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={this.onCropChange}
                  onCropComplete={this.onCropComplete}
                  onZoomChange={this.onZoomChange}
              />
            </div>
          </div>
          <footer className="group-buttons" style={{paddingTop: 24}}>
            <button onClick={this.handleCrop} className="alert button--action button--action-filled">Crop</button>
              {/*<button onClick={this.closeModal} className="alert button--action button--action-outline button--action--cancel">Cancel</button>*/}
          </footer>
        </Modal>
    )
  }

  render() {
    const { allImages } = this.state;

    const imageComponents =
        allImages && allImages.length > 0
        ? allImages.map((image, index) => {
            return (
              <BranchImageEdit
                id={image.id}
                newlyAdded={image.newlyAdded}
                imgPath={image.imgPath}
                altDesc={image.altDesc}
                onRemove={this.handlers.onImageRemove}
                key={index}
              />
            );
          })
        : "";

    return (
      <div>
        <ul>{imageComponents}</ul>
        <div id="image-add" className="image--add">
          <div className="add-item dashed">
            <input
              className="input--edit-file"
              type="file"
              onChange={e => this.handlers.handleImageChange(e, this.props)}
              name="branch-upload-image"
            />
          </div>
        </div>
        {this.renderPopup()}
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onUploadSubmit: PropTypes.func,
  onChange: PropTypes.func,
  images: PropTypes.array
};

export default ImageUpload;
