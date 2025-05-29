import React, { act, useEffect, useRef, useState } from "react";
import useProfile from "../hook/useProfile";
import { LiaEdit } from "react-icons/lia";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import FollowButton from "../components/FollowButton";
import useFollowStatus from "../hook/useFollowStatus";
import DisplayFollowListModal from "../components/Modal/ShowFollowListModal";
import { useEditProfileService } from "../hook/useEditProfileService";
import UploadCoverModal from "../components/Modal/UploadCoverModal";
import { uploadSingleImage } from "../services/uploadService";
import Media from "../components/Media";
import { useSelector } from "react-redux";

function ProfilePage() {
  const {id} = useParams();
  
  const { setShowEditModal, setShowCreatePostModal} = useOutletContext();
  const {handleUpdateCover} = useEditProfileService();
  const [selfProfile, setSelfProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  const [showUploadCoverModal, setShowUploadCoverModal] = useState(false);
  const {setShowLoading, reloadPosts, reloadProfile, reloadProfileFlag} = useOutletContext();
  const [reloadPostList, setReloadPostList] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const currentUser = useSelector(state => state.user.currentUser); 
  const userId = id || currentUser?.id;
  const { updateProfileLocally, profile, loading, error } = useProfile(userId, currentUser);
  
  const followStatus = useFollowStatus(
    profile?.id && !loading ? profile.id : null,
    selfProfile
  );  

  const [showFollowListModal, setShowFollowListModal] = useState(false);
  const [followListType, setFollowListType] = useState("followers");
  
  //DETERMINE SELF PROFILE OR NOT
  useEffect(() => {
    if (!id || Number(id) === currentUser?.id) {
      setSelfProfile(true); 
    } else {
      setSelfProfile(false); 
    }
  }, [id, currentUser?.id,]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  //HANDLE UPLOAD COVER
  const uploadCoverRef = useRef(null);
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (uploadCoverRef.current && !uploadCoverRef.current.contains(event.target)) {
            setShowUploadCoverModal(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  return (
    <div className="md:ml-9 lg:ml-0 flex flex-col items-center pb-18 overflow-x-hidden">
      <div className={`w-full h-96 relative
                      ${profile?.bio?.trim() ? "mb-28 xl:mb-20 " : "mb-8"}`}>
        <div className="w-full h-4/5 md:rounded-b-4xl bg-cover bg-center relative group"
              style={{
                backgroundImage: profile?.cover_url
                  ? `url(${profile.cover_url})`
                  : "linear-gradient(to top right, #fd9739, #e75982, #c91dc4)"
              }}>
          {/* Change Cover Button */}
          {
            selfProfile &&
          <div
              onClick={() => { setShowUploadCoverModal(true)}}
              className="absolute top-10 right-20 md:right-30 xl:right-60 px-2 py-2 z-[99]
                        bg-light-button dark:bg-dark-button dark:text-dark-text text-sm
                        hover:bg-light-button-hover dark:hover:bg-dark-card-border
                        shadow-xl rounded-lg cursor-pointer border-2 border-light-input-border dark:border-dark-border
                        opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto">
              Change Cover
              
              {showUploadCoverModal && (
                <UploadCoverModal
                  ref={uploadCoverRef}
                  onClose={() => setShowUploadCoverModal(false)}
                  onSubmit={async ({ file, url }) => {
                      try {
                        setShowLoading(true);
                        let cover_url = "";
                        let cover_public_id = null;
                
                        if (file) {
                            const uploaded = await uploadSingleImage(file, "cover", profile.id);
                            console.log(uploaded);
                            cover_url = uploaded.url;
                            cover_public_id = uploaded.publicId;
                        } else if (url) {
                            cover_url = url;
                        }
                
                        await handleUpdateCover({
                            cover_url,
                            cover_public_id,
                        });
                
                        updateProfileLocally({ cover_url });
                        setShowUploadCoverModal(false);
                    } catch (err) {
                        console.error("Error updating cover:", err);
                    } finally {
                        setShowLoading(false);
                    }
                  }}
                />
              )}
          </div>
          }
        </div>

        <div className="absolute -bottom-5 left-2 md:left-8 flex items-end gap-4">
            {/* Avatar */}
            <div className="w-36 aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-300 dark:border-dark">
              {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* User Info */}
          <span className={`text-black text-2xl font-bold drop-shadow dark:text-dark-text flex flex-col gap-2 absolute left-[10rem]
                          top-16
                          w-[10rem] sm:w-[14rem] lg:w-[20rem] xl:w-[25rem]`}>
              {loading ? (
                <>
                  <div className="w-48 h-6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-64 h-4 bg-gray-300 rounded animate-pulse mt-1"></div>
                  <div className="w-72 h-4 bg-gray-300 rounded animate-pulse mt-1"></div>
                </>
              ) : (
                <>
                  {profile.username}
                  <span className="text-[1rem] text-gray-500 dark:text-dark-text-subtle font-[400] flex gap-2 text-nowrap">
                    <span className="flex gap-1">
                    <span className="text-black font-medium dark:text-dark-text">
                      {followStatus.followCount?.followers ?? "0"}
                    </span>
                      <span className="hover:underline cursor-pointer"
                            onClick={() => {
                              setFollowListType("followers");
                              setShowFollowListModal(true);
                            }}>
                        Followers
                      </span>
                    </span>
                    <span className="flex gap-1">
                      <span className="text-black font-medium dark:text-dark-text">
                        {followStatus.followCount?.following ?? "0"}
                      </span> 
                      <span className="hover:underline cursor-pointer"
                            onClick={() => {
                              setFollowListType("following");
                              setShowFollowListModal(true);
                            }}>
                        Following
                      </span>
                    </span>
                  </span>
                  {profile.bio?.trim() && (
                    <span className="text-[1rem] text-gray-500 dark:text-dark-text-subtle font-[400]">
                      {profile.bio}
                    </span>
                  )}
                </>
              )}
            </span>
          </div>

          {/* Edit Button */}
          { selfProfile && 
            <LiaEdit
            size={40}
            className="absolute bottom-3 right-8 p-2 rounded-xl bg-light-button flex justify-center items-center text-black cursor-pointer hover:bg-light-button-hover transition dark:bg-dark-button dark:hover:bg-dark-button-hover dark:text-dark-text"
            title="Edit Profile"
            onClick={() => setShowEditModal(true)}
          />}

        {/* FOLLOW BUTTON */}
        <FollowButton targetUserId={profile?.id ?? null} selfProfile={selfProfile} right="right-2 sm:right-10" />
      </div>
      {/* CREATE POST */}
      {
        selfProfile && 
        <div className="h-16 w-[30rem] md:w-[25rem] lg:w-[35rem] rounded-2xl p-2 mt-6 mb-6
                    bg-light-card border border-light-button-hover
                    dark:bg-dark-card dark:border-dark-card-border">
        <div className="h-full flex items-center gap-4">
          <div className="h-full aspect-square rounded-full border-4 border-white overflow-hidden bg-gray-300 dark:border-dark">
              {loading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div
              className="w-[80%] h-full bg-light-input border border-light-input-border rounded-full
                        flex items-center px-6
                        cursor-pointer hover:bg-light-input-hover
                        dark:bg-dark-inputCard dark:border-dark-input-border
                        dark:text-dark-text dark:hover:bg-dark-inputCard-hover"
            >
              {
                profile ? (
                  <span onClick={() => setShowCreatePostModal(true)}>Hi {profile.username}, what do you want to share today?</span>
                ) : (
                  <span className="text-gray-400 dark:text-dark-text-subtle">Loading profile...</span>
                )
              }
            </div>
        </div>
      </div>
      }
      <div className="min-h-16 w-[30rem] md:w-[32rem] lg:w-[45rem]
                      flex flex-col items-center">
        {/* HEADER */}
        <div className="sticky top-15 md:top-0 z-10 bg-white dark:bg-dark h-16 w-full md:w-[130%] flex justify-around text-sm">
            <div className="relative w-[80%] h-ful flex justify-around border-b-1 border-light-border
                        dark:border-dark-border">
              {/* UNDERLINE */}
              <div
                className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-black dark:bg-light transition-transform duration-300 ease-in-out
                            ${activeTab === "post" ? "translate-x-0" : "translate-x-full"}`}
              />
              {/* TABS */}
              <div
                className={`flex-1 uppercase h-full flex items-center justify-center cursor-pointer dark:text-dark-text
                            ${activeTab === "post" ? "font-semibold" : ""}`}
                onClick={() => setActiveTab("post")}
              >
                post
              </div>
              <div
                className={`flex-1 uppercase h-full flex items-center justify-center cursor-pointer dark:text-dark-text
                          ${activeTab === "media" ? "font-semibold" : ""}`}
                onClick={() => setActiveTab("media")}
              >
                media
              </div>
            </div>
        </div>
        {/* CONTENT */}
        {
          activeTab === "post" && !loading && profile && (
            <PostList profile={profile} loadingProfile={loading} userId={profile.id} reloadPosts={reloadPosts} />
          )
        }
        {
          activeTab === "media" && !loading && profile && (
            <Media userId={profile.id} profile={profile} currentUser={currentUser?.id}/>
          )
        }
      </div>
      {/* FOLLOW LIST MODAL */}
      {showFollowListModal && (
        <DisplayFollowListModal
          title={followListType === "followers" ? "Followers" : "Following"}
          userId={id || currentUser?.id}
          followListType={followListType}
          onClose={() => setShowFollowListModal(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;