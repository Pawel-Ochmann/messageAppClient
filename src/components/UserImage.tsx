import { getAddress } from '../utils/serverAddress';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserImage = ({ userName }: { userName: string }) => {
  const imagePath = getAddress(`/${userName}/avatar`);
  const [imageAddress, setImageAddress] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(imagePath);
        if (response.status === 200) {
          setImageAddress(imagePath);
        } else {
          throw new Error('Image not found');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageAddress(null);
      }
    };

    fetchImage();
  }, [imagePath]);

  const openImageDialog = () => {
    setOpenDialog(!openDialog);
  };

  const ImageForm = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0];
      setFile(selectedFile);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        if (file) {
          const formData = new FormData();
          formData.append('avatar', file);
          console.log(file);
          await axios.post(getAddress(`/${userName}/avatar`), formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await axios.post(getAddress(`/${userName}/avatar`), null);
        }

        setFile(null);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <dialog open={openDialog}>
        <button onClick={openImageDialog}>X</button>
        <h2>Image Form</h2>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <div>
            <input type='file' name='avatar' onChange={handleFileChange} />
          </div>
          <div>
            <button type='submit'>
              {!file ? 'Remove Current Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </dialog>
    );
  };

  return imageAddress ? (
    <>
      <button onClick={openImageDialog}>
        <img src={imageAddress} alt={`${userName}'s profile`} />
      </button>
      <ImageForm />
    </>
  ) : (
    <>
      <button onClick={openImageDialog}>{userName[0]}</button>
      <ImageForm />
    </>
  );
};

export default UserImage;
