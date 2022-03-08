import firebase from '../firebase/firebase';
export const uploadFile = async (imagePath, image, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadTask = firebase.storage().ref(imagePath).put(image);
    uploadTask.on(
     "state_changed",
     snapshot => {
 
     },
     error => {
         console.log(error);
     },
     () => {
       firebase.storage()
         .ref(folderName)
         .child(image.name)
         .getDownloadURL()
         .then(url => {
           resolve(url);
         });
     }
   );
  });


}