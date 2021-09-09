import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { ProfileActivity } from "../../app/models/activity";

interface Props {
    activity: ProfileActivity
}

export default observer(function ProfileEventCard({ activity }: Props) {

    console.log(activity)
    return (
        <Card as={Link} to={`/activities/${activity.activityId}`}>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content textAlign='center'>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Description>{format(new Date(activity.date!),
                    'do LLL')}</Card.Description>
                <Card.Description>{format(new Date(activity.date!),
                    'h:mm a')}</Card.Description>
            </Card.Content>


        </Card>
    );
})