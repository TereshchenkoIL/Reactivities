import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { ProfileActivity } from "../models/activity";
import { Photo, Profile, ProfileUpdateData } from "../models/profile";
import { store } from "./store";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    deleting = false;
    followings: Profile[] = [];
    loadingFollowings: boolean = false;
    loadingActivities: boolean = false;
    activeTab = 0;
    activityTab = -1;
    activities: ProfileActivity[] = [];

    constructor(){
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
            if(activeTab === 3 || activeTab === 4)
            {
                const predicate = activeTab === 3 ? 'followers' : 'following';
                this.loadFollowings(predicate);
            } else {
                this.followings = [];
            }
        })

        reaction(
            () => this.activityTab,
            activityTab=> {
            if(activityTab === 0)
            {
                this.loadActivities(this.profile!.username, "future");
            }
            else if(activityTab === 1 ){
                this.loadActivities(this.profile!.username, "past");
            }
            else if(activityTab === 2 ){
                this.loadActivities(this.profile!.username, "hosting");
            }
            else {
                this.followings = [];
            }
        })
    }

    loadActivities = async (username: string, predicate: string) => {
        try{
            this.loadingActivities = true;
            this.activities = await agent.Profiles.getActivities(username, predicate)

            runInAction(() => {
                this.loadingActivities = false;
            });
        } catch(error){
            console.log(error)
            runInAction(() => {
                this.loadingActivities = false;
            });
        }
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }
    setActivityTab = (activityTab: any) => {
        this.activityTab = activityTab;
    }

    get isCurrentUser(){
        if(store.userStore.user && this.profile)
        {
            return store.userStore.user.username === this.profile.username;
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
            this.loadActivities(this.profile!.username, "future");
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try{
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;

            runInAction(() => {
                if(this.profile){
                    this.profile.photos?.push(photo);
                    if(photo.isMain && store.userStore.user){
                       store.userStore.setImage(photo.url);
                       this.profile.image = photo.url;
                    }
                    this.uploading = false;
                
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try{
            await agent.Profiles.setMainPhoto(photo.id)

            store.userStore.setImage(photo.url)

            runInAction(() => {
                if(this.profile && this.profile.photos)
                {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;

                    this.profile.image = photo.url;
                    this.loading = false;
                }
            });
        } catch (error){
            console.log(error)
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (id: string) => {
        this.deleting = true;
        try{
            
            await agent.Profiles.deletePhoto(id);

            runInAction(() => {
                this.profile!.photos = this.profile?.photos?.filter(photo => photo.id !== id);
                this.deleting = false;
            });
        } catch( error ) {
            console.log(error);
            runInAction(() => this.deleting = false);
        }
    }

    updateProfile = async (updateData: ProfileUpdateData) => {
        this.loading = true;

        try{
            var profile = await agent.Profiles.updateProfile(updateData);
            var user = await agent.Account.current();
            runInAction(() => {
                if(profile){
                    this.profile = profile;
                    store.userStore.user = user;
                    this.loading = false;
                    
                }
            });
        } catch(error) {
            
            runInAction(() => this.loading=false );
            throw error;
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try{
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if(this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username){
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                if(this.profile && this.profile.username === store.userStore.user?.username){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if(profile.username === username){
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following
                    }
                })
                this.loading = false;
            });
        } catch(error){
            console.log(error);
            runInAction(() => this.loading = false);
        }

    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);

            runInAction(() => {
                this.followings = followings;
                console.log(followings);
                this.loadingFollowings = false;
            })
        try{

        } catch(error){
            console.log(error)
            runInAction(() => this.loadingFollowings = false);
        }

    }
}