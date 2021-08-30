import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { toast } from "react-toastify";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile
}
export default observer(function ProfilePhotos({ profile }: Props) {

    const { profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto, deleting } } = useStore();

    const [addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState('');
    const [deletingTarget, setDeletingTarget] = useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo) {
        if (photo.isMain) {
            toast.info("You can't delete main photo")
            return;
        }
        setDeletingTarget(photo.id);
        deletePhoto(photo.id);
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />

                    {isCurrentUser && (

                        <Button floated='right'
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>

                                            <Button
                                                basic
                                                color='green'
                                                content='Main'
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={target === photo.id && loading}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />

                                            <Button basic color='red' icon='trash'
                                                disabled={photo.isMain}
                                                loading={deletingTarget === photo.id && deleting}
                                                onClick={() => handleDeletePhoto(photo)}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}


                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    );

})