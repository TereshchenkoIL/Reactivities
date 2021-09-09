import { observer } from 'mobx-react-lite'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'
import ProfileActivities from './ProfileActivities'
import ProfileEventCard from './ProfileEventCard'

const panes = [
    {
        menuItem: 'Future events',
        render: () => <ProfileActivities />,
    },
    {
        menuItem: 'Past events',
        render: () => <ProfileActivities />,
    },
    {
        menuItem: 'Hosting',
        render: () => <ProfileActivities />,
    },
]

export default observer(function ActivityTabs() {
    const { profileStore } = useStore();
    return (
        <Tab.Pane>
            <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                onTabChange={(e, data) => profileStore.setActivityTab(data.activeIndex)}

            />
        </Tab.Pane>
    )
});