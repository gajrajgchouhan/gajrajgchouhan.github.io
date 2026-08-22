---
title: How to upload files using react-hook-form in a React app?
date: 2022-05-21
slug: how-to-upload-files-using-react-hook-form-in-a-react-app
status: published
---

This tutorial assume basic knowledge of react-hook-form, check out their helpful tutorials first here if you are new. https://react-hook-form.com/get-started/

Let's take an example of a form where you need to upload files.

First we setup react-hook-form with the form along with the validation. I have done it by simply using a `<input type="file" />`, we can easily setup the validation by using `Yup.mixed()` as the data type.

We need to understand how javascript really uploads a file in a secure manner. When user uploads a file the metadata and location is stored inside a `File` object. Details are available at https://developer.mozilla.org/en-US/docs/Web/API/File

To read the `File` object, use the `FileReader` object. It will read the file and get its content. It has lots of methods available,

1.  readAsDataURL()
    
    Used for reading the content as an base64 string.
    
    Note : We cant directly decode the string as the data URL contains `data:` as the prefix of string.
    
    ```
            We will see how to do that in the backend below.
    ```
    
2.  readAsText()
    
    Used for reading the content as text string, best used with text.
    
3.  readAsArrayBuffer()
    
4.  readAsBinaryString()

The FileReader object has two attributes `onload` and `onerror` whose value will be a callback function when the file is successfully read and some error occured while reading respectively.

Also there is a `result` attribute from which you can access the read file.

Since the reading of file is async, we use Promise based approach to avoid any callback hells. The idea is to resolve the promise when the file is read successfully.

```js
function readFile(file) {
    return new Promise((resolve, reject) => {
        const filereader = new FileReader();
        filereader.onload = () => {
            console.log(filereader.result);
            console.log(filereader.result.toString());
            resolve(filereader.result.toString());
        };
        filereader.onerror = (error) => reject(error);
        filereader.readAsDataURL(file);
    });
}
```

Lets complete the function to handle the submission of form.

```jsx
<form
    onSubmit={handleSubmit(async (data) => {
        data.fileContent = await readFile(data.Image[0]);
        // upload to backend using API
    })}
>
    <input type="file" />
</form>
```

For reference the base64 string will look like this `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA9QAAAR+CAMAAAAGKo2wAAAC/` and will be large depending on the size of image.

As we can see the prefix contains the metadata about the file useful for telling its type. After string after `base64,` is the actual string in the base64 which we will read.

So how can we extract the actual string, why ofcourse using regular expressions. Just define a pattern similiar which can capture all the stuff before the actual string, then use the replace method of string to remove it ! We will read the base64 using Buffer object which is widely supported, I have used AWS in the backend for uploading the process will not be so different for other providers.

```js
const uploadFile = async (base64Data) => {
    try {

        // read the file
        const buf = new Buffer.from(
            base64Data.replace(/^data:.+;base64,/, ""),
            "base64"
        );

        const check = await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: uuidv4(),
                Body: buf,
                ContentType: base64Data.substring(
                    base64Data.indexOf(":") + 1,
                    base64Data.indexOf(";")
                ),
            })
            .promise();
        return check.Location;
    } catch (error) {
        console.log(base64Data)
        console.error(error);
        return null;
    }
};
```

Another thing to learn after this is the streaming approach where we dont have to send the whole file due to the large size it may have. I hope to you use that soon in the future.

Did I tell you I love promises ? :P
