import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { exit } from 'process';
import { CacheService } from 'ionic-cache';
import { EventsCustomService } from './events-custom.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  userDetail;

  constructor(
    private actRouter: ActivatedRoute,
    private cache: CacheService,
    private eventCustom: EventsCustomService,
    private socket: Socket,
    private http: HttpClient) {
    this.actRouter.queryParams.subscribe(() => {
      this.connectFuntion();
      this.cache.clearAll().then(() => {
        // console.log('clearCahce Form API');
      });
    });
  }
  socketEmit(eventToFire: string, data: any) {
    this.connectFuntion();
    this.socket.emit(eventToFire, data);
  }
  connectFuntion() {
    this.socket.connect();
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    if (!this.userDetail) {
      this.eventCustom.subscribe('userDetail', (e: any) => {
        this.userDetail = e;
      });
    }
    if (this.userDetail) {
      this.socket.emit('login', { id: this.userDetail.tokenid }, (res) => {
      });
    }
  }

  reloadApp() {
    setTimeout(() => {
      this.socket.emit('reloadApp');
      this.connectFuntion();
      // window.location.reload();
    }, 800);
  }
  userAuthentication(userName, password) {
    const headersCustom = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'No-Auth': 'True',
      // 'Cache-Control': 'no-cache',
      'Cache-Control': 'no-store',
    });

    const params = new HttpParams().set('username', userName).set('password', password);

    interface PostReturn {
      status: string;
      data: any;
      message: string;
      loginstatus: any;
    }
    return new Promise((resolve, reject) => {
      this.http.post<PostReturn>(environment.apiUrl + 'v1/api/user/login',
        params, { headers: headersCustom }).subscribe(
          data => {
            resolve(data);
          }, (err: HttpErrorResponse) => {
          });
    });
  }
  // Uploads
  uploadgroupchat_mobile(file: File, teamid) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadgroupchat_mobile';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('groupid', teamid);
      return this.http.post(endpoint, formData);
    }
  }

  uploadteam_mobile(file: File, teamid) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadteam_mobile';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('teamid', teamid);
      return this.http.post(endpoint, formData);
    }
  }
  uploadTeamGroupCover(file: any, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadteam_mobile_temp';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('userid', userid);
      return this.http.post(endpoint, formData);
    }
  }
  updateTeamcover(file: File, teamid) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadteam_mobile';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('teamid', teamid);
      return this.http.post(endpoint, formData);
    }
  }

  updateGroupcover(file: File, grpid) {
    const endpoint = environment.apiUrl + 'v1/api/post/uploadgroupchat_mobile';
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('groupid', grpid);
    return this.http.post(endpoint, formData);
  }

  deleteUploadImage(Original, thumb) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/postimage_delete`, { original: Original, thumbnail: thumb });
      // const endpoint = environment.apiUrl + 'v1/api/post/postimage_delete';
      // const formData: FormData = new FormData();
      // formData.append('original', original);
      // formData.append('thumbnail', thumb);
      // return this.http.post(endpoint, formData);
    }
  }

  uploadTimelineMedia(file, userid, filename) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadMedia';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('userid', userid);
      formData.append('filename', filename);
      formData.append('uploadtype', 'camera');
      return this.http.post(endpoint, formData);
    }
  }
  signup_mobile_temp(file: any) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/post/uploadphotoprofile_mobile_temp';
      const formData: FormData = new FormData();
      formData.append('file', file);
      return this.http.post(endpoint, formData);
    }
  }
  uploadcoverprofile(file: any, userid) {
    const endpoint = environment.apiUrl + 'v1/api/post/uploadphotoprofile1';
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userid', userid);
    return this.http.post(endpoint, formData);
  }
  uploadprofile(file: File, userid) {
    const endpoint = environment.apiUrl + 'v1/api/post/uploadphotoprofile_mobile';
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userid', userid);
    return this.http.post(endpoint, formData);
  }



  // ---- Functions
  getIntroData() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/getIntroInfo`, {});
  }

  getCountryList() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/getAllCountry`, '');
  }

  signup_validation() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/signup_validation`, '');
  }

  signup_mobile(fName, lName, emailId, confirmpassword, dob, sex, cityIn, countryIn, languageIn, profileImg, extrnalImg, willBeScout) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/signup_mobile/`,
      {
        firstname: fName,
        lastname: lName,
        email: emailId,
        password: confirmpassword,
        birthday: dob,
        gender: sex,
        city: cityIn,
        country: countryIn,
        telephone: '',
        language: languageIn,
        profile_img: profileImg,
        externalProfileImage: extrnalImg,
        will_be_scout: willBeScout
      });
  }

  userlogin(username, pass, divcToken, deviceUser) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/login_mobile/`,
      { email: username, password: pass, devicetoken: divcToken, device: deviceUser });
  }
  updateFirstLogin(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/user/updateFirstLogin`, { userId: userid });
    }
  }
  userloginAsMinor(username, pass, divcToken, deviceUser, minorid) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/loginAsMinor/`,
      { email: username, password: pass, devicetoken: divcToken, device: deviceUser, minorId: minorid });
  }
  deleteUser(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deactivateUser`,
        { userId: userid });
    }
  }
  verifyPassword(userid, pass) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/verifyPassword`, {
        userId: userid,
        password: pass
      });
    }
  }

  checkUserValidity(userid) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/getSessionValidity`,
      { userId: userid });
  }


  versionCheck(plat) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/getAppVersions`, { platform: plat });
  }

  registerToken(divcToken, username) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/user/registerToken/`, { devicetoken: divcToken, email: username });
    }
  }

  logout(tokenIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/user/logout`, { token: tokenIn, type: 'Mobile' });
    }
  }

  forgetPassword(emailId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/user/findTargetEmail`, { email: emailId });
    }
  }
  languageFile(lang) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/language/`, { language: lang });
  }
  tribationLanguages() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/getlanguages_mobile/`, {});
  }
  saveChangedLanguage(userId, languagevalue) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/saveChangedLanguage`, { userid: userId, language: languagevalue });
    }
  }

  getUserBaseInfoByUserId(id, tId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getUserBaseInfoByUserId`, { user_id: id, target_user_id: tId });
    }
  }

  getSportLists() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/sports/get_sports_list`, {});
  }


  serachInApp(stringToFind) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/search/searchStuff`, { query: stringToFind });
    }
  }
  searchDiscoveryByPost(stringToFind) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/searchDiscoveryByPost`, { searchTerm: stringToFind });
    }
  }

  // getTimelinePosts(userId, limitOfPosts, skipFirst) {
  //   if (this.canConnect()) {
  //     this.connectFuntion();
  //     return this.http.post(`${environment.apiUrl}v1/api/post/getTimelinePosts`,
  //       { user_id: userId, limit: limitOfPosts, offset: skipFirst });
  //   }
  // }
  getAllPostNew(limitIn, offsetIn, userid, useroffsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getAllPostFriends`,
        { offset: offsetIn, limit: limitIn, user_id: userid, useroffset: useroffsetIn });
    }
  }

  getAllPostNew1(limitIn, offsetIn, userid, useroffsetIn) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/post/getAllPostNew1 `,
      { offset: offsetIn, limit: limitIn, user_id: userid, useroffset: useroffsetIn });
  }

  getAllPostFriends(limitIn, offsetIn, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getAllPostFriends  `, { offset: offsetIn, limit: limitIn, user_id: userid });
    }
  }

  getFollowingSportsData(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getFollowingSportsData`, { user_id: userId });
    }
  }

  getFriendsList(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getFriendsList`, { user_id: id, offset: 0, limit: 2000, query: [] });
    }
  }
  getallsportpost(sportsId, offsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getAllPostBySportId`, { sportid: sportsId, limit: 2000, offset: offsetIn });
    }
  }

  getAllPostBySportId_new(sportsid, offsetIn, userId, useroffsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getAllPostBySportId_new`,
        { sportid: sportsid, limit: 20, offset: offsetIn, user_id: userId, useroffset: useroffsetIn });
    }
  }


  getBasicUserInfo(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getBasicUserInfo`, { userId: userid });
    }
  }


  getPostTimeline(offsetIn, userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getTimelinePosts_temp`,
        { limit: 20, offset: offsetIn, user_id: userId });
    }
  }
  getIntroVideoData() {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/user/getIntroVideos`, {});
  }

  getUserProfilePageData(liMit, ofFset, userId, meId) {
    if (this.canConnect()) {
      this.connectFuntion();
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getUserProfilePageData_temp`,
        {
          limit: liMit,
          offset: ofFset,
          user_id: userId,
          me: meId
        });
    }
  }
  savePostTimeline(postId, userId, contentText, sportsId, media, mentionsIds) {
    if (this.canConnect()) {
      this.connectFuntion();
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/savePost`, {
        id: postId,
        user_id: userId,
        content: contentText,
        sports_id: sportsId,
        assets: media,
        mentions: mentionsIds
      }, {
        reportProgress: true,
        observe: 'events'
      });
    }
  }
  deletePostTimeline(postId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/deletePost`, { post_id: postId });
    }
  }
  likePost(userid, postid) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/post/likePost`,
      { user_id: userid, post_id: postid });
  }
  unLikePost(userid, postid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/unlikePost`,
        { user_id: userid, post_id: postid });
    }
  }
  sharePost(userId, postId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/sharePost`, { user_id: userId, post_id: postId });
    }
  }
  unSharePost(userid, postId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/unSharePost`, { user_id: userid, post_id: postId });
    }
  }


  getPostByPostId(postId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getPostByPostId`, { post_id: postId });
    }
  }
  getsharelikecommentpost(userId, postId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/getPostLikeAndCommentsShared`, { user_id: userId, post_id: postId });
    }
  }


  addComment(userToken, postId, commentText, userId, postUserId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/addComment`,
        { token: userToken, post_id: postId, comment: commentText, user_id: userId, post_user_id: postUserId });
    }
  }

  addReply(userToken, postId, replyText, userId, commentId, commenterId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/post/addReply`,
        {
          token: userToken,
          post_id: postId,
          reply_content: replyText,
          user_id: userId,
          comment_id: commentId,
          commenter_id: commenterId
        });
    }
  }
  getBadgeCriteria(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getBadgeCriteria`,
        { userId: id });
    }
  }

  // Requests
  getFriendRequest(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getFriendRequests`,
        { userId: id, offset: 0, limit: 20 });
    }
  }
  getGroupchatRequest(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGroupchatRequest`, { user_id: userid });
    }
  }
  getTeamRequest(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamRequest`, { user_id: id });
    }
  }
  getGuardianReqAsGuardian(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGuardianRequestsForGuardian`, { userId: id });
    }
  }
  getGuardianReqAsAthlete(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGuardianRequestsForAthlete`, { userId: id });
    }
  }
  acceptTeamInviteRequest(id, teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/acceptTeamInviteRequest`, { user_id: id, teamid: teamId });
    }
  }
  rejectTeamInviteRequest(id, teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/rejectTeamInviteRequest`, { user_id: id, teamid: teamId });
    }
  }
  acceptGroupchatInviteRequest(userid, groupId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/acceptGroupchatInviteRequest`, { user_id: userid, groupid: groupId });
    }
  }
  rejectGroupchatInviteRequest(userid, groupId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/rejectGroupchatInviteRequest`, { user_id: userid, groupid: groupId });
    }
  }
  seenRequests(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/viewRequests`, { userId: userid });
    }
  }

  // Team And Events
  getAllMyTeamEvents(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamEventListbyUserid`, { user_id: userid });
    }
  }
  starAddEvent(teamidRes, eventidRes, useridRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/starAddEvent`,
        { teamid: teamidRes, eventid: eventidRes, userid: useridRes });
    }
  }
  starRemoveEvent(teamidRes, eventidRes, useridRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/starRemoveEvent`,
        { teamid: teamidRes, eventid: eventidRes, userid: useridRes });
    }
  }
  starStatusEvent(teamidRes, eventidRes, useridRes) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/starStatusEvent`,
      { teamid: teamidRes, eventid: eventidRes, userid: useridRes });
  }
  listTeamEvent(userId, teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamEventList `, { userid: userId, teamid: teamId });
    }
  }
  deleteTeamEvent(userId, teamId, idEvent) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteTeamEvent  `,
        { userid: userId, teamid: teamId, eventid: idEvent });
    }
  }
  addTeamEvent(userId, teamId, eventTitle, eventDescription, eventDate, eventVenue, teamName) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/createTeamEvent `,
        {
          userid: userId,
          teamid: teamId,
          title: eventTitle,
          description: eventDescription,
          eventdate: eventDate,
          venue: eventVenue,
          teamname: teamName
        });
    }
  }
  updateTeamEvent(userId, teamId, eveTitle, eveDescription, eveDate, eveVenue, eveId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamEvent`,
        { userid: userId, teamid: teamId, title: eveTitle, description: eveDescription, eventdate: eveDate, venue: eveVenue, id: eveId });
    }
  }
  getTeamList(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamList`, { user_id: userId });
    }
  }
  getMyTeamList(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getMyTeamList`, { user_id: userId });
    }
  }
  getTeamMembers(teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamMembers`, { teamid: teamId });
    }
  }
  updateGroupChatData(userId, groupName, groupDesc) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateGroupChatData`,
        { id: userId, name: groupName, description: groupDesc });
    }
  }
  updateTeamData(userId, teamName, teamDesc) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamData`,
        { id: userId, name: teamName, description: teamDesc });
    }
  }
  // updateTeamName(teamId, teamName) {
  //   if (this.canConnect()) {
  //     this.connectFuntion();
  //     return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamName`, { teamid: teamId, teamname: teamName });
  //   }
  // }
  // updateTeamDesc(teamId, teamDesc) {
  //   if (this.canConnect()) {
  //     this.connectFuntion();
  //     return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamDesc`, { teamid: teamId, teamdesc: teamDesc });
  //   }
  // }
  createNewTeam(userId, teamName, teamDesc, teamPicCoverOriginal, teamPicCoverThumb) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/createNewTeam`,
        { userid: userId, name: teamName, info: teamDesc, pic: teamPicCoverOriginal, pic_small: teamPicCoverThumb });
    }
  }

  makeTeamAdmin(userId, teamId, actionRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamMembers`,
        { user_id: userId, teamid: teamId, action: actionRes });
    }
  }
  dismissTeamAdmin(userId, teamId, actionRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamMembers`,
        { user_id: userId, teamid: teamId, action: actionRes });
    }
  }
  removeTeamMember(userId, teamId, actionRes, membercountRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateTeamMembers`,
        { user_id: userId, teamid: teamId, action: actionRes, membercount: membercountRes });
    }
  }

  addTeamMembers(userId, teamId, membersToAdd, typeRes, membersCount) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/addTeamMembers`,
        { userid: userId, teamid: teamId, members: membersToAdd, type: typeRes, membercount: membersCount });
    }
  }
  addNewTeamMembers(userId, teamId, teamMembers, teamName) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/addTeamMembers`,
        { userid: userId, teamid: teamId, members: teamMembers, type: 1, teamname: teamName });
    }
  }

  editProfileInfo(id, fName, lName) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/admin/userprofile/updateProfileInfo`, {
        user_id: id,
        first_name: fName,
        last_name: lName
      });
    }
  }

  editPortfolioProfileInfo(
    id, countryCode, stateOrProvince, ciTy, birthDay, heightUnit, heigHt, weightUnit, weigHt, coverImg, genDer) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/admin/userprofile/updateProfileInfo`, {
        user_id: id,
        country_code: countryCode,
        stateProvince: stateOrProvince,
        city: ciTy,
        birthday: birthDay,
        height_unit: heightUnit,
        height: heigHt,
        weight_unit: weightUnit,
        weight: weigHt,
        profile_bg_img_url: coverImg,
        gender: genDer,
      });
    }
  }

  changePassword(userId, currentPassword, newPassword) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/changePassword`,
        { user_id: userId, current_password: currentPassword, new_password: newPassword });
    }
  }

  privacySettingData(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getWhoCanDowithMe`, { user_id: id });
    }
  }
  updatePrivacySetting(id, optionDataRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/changeWhoWithMeData`, { user_id: id, optionData: optionDataRes });
    }
  }

  notification_setting_list(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/notification_setting_list`, { userid: userId });
    }
  }
  notificationSettingChange(userId, typeRes, actionRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/notification_setting`,
        { userid: userId, type: typeRes, action: actionRes });
    }
  }
  updateLookedFlag(userid) {
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/updateLookedFlag_notification`, { user_id: userid });
  }
  reportInfo() {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/reportinfo`, {});
    }
  }

  reportCommon(userId, typeRes, desc) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/report_common`,
        { userid: userId, type: typeRes, description: desc });
    }
  }

  reportuser(id, reportReason, reportType, selectReason, fromUserid, stuffId) {
    // console.log(id, reportReason, reportType, selectReason, fromUserid, stuffId);
    if (this.canConnect()) {
      this.connectFuntion();
      if (stuffId !== null) {
        return this.http.post(`${environment.apiUrl}v1/api/userprofile/reportuser`,
          {
            user_id: id, report_reason: reportReason, report_type: reportType,
            select_reason: selectReason, from_userid: fromUserid, stuff_id: stuffId
          });
      } else {
        return this.http.post(`${environment.apiUrl}v1/api/userprofile/reportuser`,
          {
            user_id: id, report_reason: reportReason, report_type: reportType,
            select_reason: selectReason, from_userid: fromUserid
          });
      }
    }
  }

  reportinfo_post() {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/reportinfo_post`, {});
    }
  }

  reportinfo_group() {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/reportinfo_group`, {});
    }
  }


  contactus() {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/contactinfo`, {});
    }
  }





  // Chats
  getGroupChatList(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGroupChatList`, { user_id: id });
    }
  }
  getRecentMessages(meRes) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/message/getRecentMessages`, { me: meRes, filterOpt: { limit: 99, offset: 0 } });
    }
  }
  getChatHistory(myId, otHer, offSet, liMit) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/message/getChatHistory`,
        { myid: myId, other: otHer, filterOpt: { limit: liMit, offset: offSet } });
    }
  }
  getgroupchatdatabyId(teamid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getgroupchatdatabyId`, { groupid: teamid });
    }
  }
  getGroupChatHistroy(userid, groupId, offSet, liMit, tyPe) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/message/getGroupChatHistory`,
        { userId: userid, group_id: groupId, filterOpt: { limit: liMit, offset: offSet }, type: tyPe });
    }
  }
  getGroupchatMembers(teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGroupchatMembers`, { teamid: teamId });
    }
  }
  groupMessageReadUpdate(userid, groupId, tyPe) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/message/groupMessageReadUpdate`,
        { userId: userid, group_id: groupId, type: tyPe });
    }
  }

  getTeamDataById(teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getteamdatabyId`, { teamid: teamId });
    }
  }
  chatimgupload(file: any, userid, filename) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/message/uploadfile_mobile';
      const formData: FormData = new FormData();
      formData.append('file', file, filename);
      formData.append('userid', userid);
      return this.http.post(endpoint, formData);
    }
  }
  createGroupChat(userId, membersIds, groupTitle, groupDesc, profileImg, profileBgImg) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/createGroupChat`,
        {
          user_id: userId,
          members: membersIds,
          title: groupTitle,
          description: groupDesc,
          profile_img: profileImg,
          profile_bg_img: profileBgImg
        });
    }
  }
  setReadMessageFlag(mE, otHer) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/message/setReadMessageFlag`, { me: mE, other: otHer });
  }
  addGroupMembers(userId, teamId, teamName, grpMembers, grpType) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/addGroupMembers`,
      { user_id: userId, teamid: teamId, teamname: teamName, members: grpMembers, type: grpType });
  }
  removeGroupchatInviteRequest(teamId, userId) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/removeGroupchatInviteRequest`, { user_id: userId, teamid: teamId });
  }
  deleteChat(userid, toid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/message/deleteChat`, { userId: userid, toId: toid });
    }
  }
  deleteGroupChat(userid, groupid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteGroupChat`, { userId: userid, groupId: groupid });
    }
  }
  getUnreadedRequestCount(userid) {
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/getUnreadedRequestedCount`, { user_id: userid });
  }

  // Notifications

  getNotification(id, liMit, offSet) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getNotification`, { user_id: id, limit: liMit, offset: offSet });
    }
  }
  getNotificationMore(id, liMit, offSet) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/loadMoreNotificationsByUserId`,
        { user_id: id, limit: liMit, offset: offSet });
    }
  }

  clearAllNotification(id) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/clearAllNotification`, { user_id: id });
    }
  }
  deleteNotification(iD) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteNotification `, { id: iD });
    }
  }



  // Portfolio

  getPortfolio(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getPortfolio `, { userId: userid });
    }
  }
  saveWorkHistory(itemId, userId, jobTitle, employerName, desc, fromDate, toDate, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/saveWorkHistory `, {
        id: itemId,
        user_id: userId,
        job_title: jobTitle,
        employer_name: employerName,
        description: desc,
        from_date: fromDate,
        to_date: toDate,
        orderPosition: itemorderPosition
      });
    }
  }
  getWorkHistory(workId) {
    this.connectFuntion();
    return this.http.post(`${environment.apiUrl}v1/api/userprofile/getWorkHistory `, { id: workId });
  }
  deleteWorkHistory(userid, workId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteWorkHistory `, { id: workId, userId: userid });
    }
  }

  getTeamHistory(teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTeamHistory `, { id: teamId });
    }
  }
  deleteTeamHistory(userid, teamId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteTeamHistory `, { id: teamId, userId: userid });
    }
  }
  saveTeamHistory(itemId, userId, teamName, CoaCh, sportsId, desc, positionId, fromDate, toDate, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/saveTeamHistory `, {
        id: itemId,
        user_id: userId,
        team_name: teamName,
        coach: CoaCh,
        sport_id: sportsId,
        player_pos: desc,
        position_id: positionId,
        from_date: fromDate,
        to_date: toDate,
        orderPosition: itemorderPosition
      });
    }
  }
  deleteTeam(teamId, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteTeam `, { id: teamId, userId: userid });
    }
  }
  leaveTeam(teamid, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/leaveTeam `, { teamId: teamid, userId: userid });
    }
  }

  getTrainingHistory(traningId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getTrainingHistory `, { id: traningId });
    }
  }
  deleteTrainingHistory(userid, traningId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteTrainingHistory `, { id: traningId, userId: userid });
    }
  }
  saveTrainingHistory(traningId, userId, academyName, instructor, traningLevel, sportsId, desc, fromDate, toDate, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/saveTrainingHistory `, {
        id: traningId,
        user_id: userId,
        academy_name: academyName,
        instructor_name: instructor,
        sport_id: sportsId,
        description: desc,
        training_level: traningLevel,
        from_date: fromDate,
        to_date: toDate,
        orderPosition: itemorderPosition
      });
    }
  }

  getEducationHistory(eduID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getEducationHistory `, { id: eduID });
    }
  }
  deleteEducationHistory(userid, eduID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deleteEducationHistory `, { id: eduID, userId: userid });
    }
  }
  saveEducationHistory(
    eduId, userId, schoolName, educationLevel, gradeOfEdu, desc, fromDate, toDate, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/saveEducationHistory `, {
        id: eduId,
        user_id: userId,
        school_name: schoolName,
        education_level: educationLevel,
        grade: gradeOfEdu,
        description: desc,
        from_date: fromDate,
        to_date: toDate,
        orderPosition: itemorderPosition
      });
    }
  }
  getPortfolioAward(eduID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getPortfolioAward `, { id: eduID });
    }
  }
  deletePortfolioAward(userid, eduID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioAward `, { id: eduID, userId: userid });
    }
  }
  savePortfolioAward(awardId, userId, awardName, awardBy, awardDate, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/savePortfolioAward `, {
        id: awardId,
        user_id: userId,
        award_name: awardName,
        awarded_by: awardBy,
        award_date: awardDate,
        orderPosition: itemorderPosition
      });
    }
  }

  getPortfolioAspiration(aspirationId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getPortfolioText `, { id: aspirationId });
    }
  }
  deletePortfolioAspiration(userid, aspirationId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioText `, { id: aspirationId, userId: userid });
    }
  }
  savePortfolioAspiration(aspirationId, userId, tiTle, texT, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/savePortfolioText `, {
        id: aspirationId,
        user_id: userId,
        title: tiTle,
        text: texT,
        orderPosition: itemorderPosition
      });
    }
  }

  getPortfolioHighlights(highlightID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getPortfolioHighlights `, { id: highlightID });
    }
  }
  deletePortfolioHighlight(userid, highlightID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioHighlight `, { id: highlightID, userId: userid });
    }
  }
  deletePortfolioHighlightMedia(mediaId, highlightID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioHighlightMedia `,
        { id: mediaId, highlight_id: highlightID });
    }
  }
  savePortfolioHighlight(highlightID, userId, highlightTitle, mediaObj, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/savePortfolioHighlight `, {
        id: highlightID,
        user_id: userId,
        title: highlightTitle,
        media: mediaObj,
        orderPosition: itemorderPosition
      });
    }
  }

  getPortfolioStatistics(statID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getPortfolioStatistics `, { id: statID });
    }
  }
  deletePortfolioStatistics(userid, statID) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioStatistics `, { id: statID, userId: userid });
    }
  }
  deletePortfolioStatisticsEntry(statisticsEntryId, statisticsId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/deletePortfolioStatisticsEntry `,
        { statisticsId: statisticsId, id: statisticsEntryId });
    }
  }
  savePortfolioStatistics(statId, userId, statTitle, entriesStat, itemorderPosition) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/savePortfolioStatistics `, {
        id: statId,
        user_id: userId,
        title: statTitle,
        entries: entriesStat,
        orderPosition: itemorderPosition
      });
    }
  }
  // Created Friend Request
  createFriendRequest(cfId, hfId) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/createFriendRequest`, { cf_id: cfId, hf_id: hfId });
    }
  }
  // Scouts
  // person wish to be scoted = Prospect
  getProspectList_Filtered(
    experienceDateFrom,
    experienceDateTo,
    ageOfPlayersFrom,
    ageOfPlayersTo,
    hightFrom,
    hightTo,
    weightFrom,
    weightTo,
    playerGender,
    sportsId,
    playerPostion,
    countryCode,
    cityOfPlayer,
    weightUnit,
    heightUnit,
    orderBy,
    sortOrder,
    limitOfResults,
    skipFirst) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/search/searchUsersByScout`, {
        limit: limitOfResults,
        offset: skipFirst,
        weight_unit: weightUnit,
        height_unit: heightUnit,
        sport_ids: sportsId,
        gender: playerGender,
        city: cityOfPlayer,
        player_pos: playerPostion,
        country_code: countryCode,
        exFrom: experienceDateFrom,
        exTo: experienceDateTo,
        htFrom: hightFrom,
        htTo: hightTo,
        wtFrom: weightFrom,
        wtTo: weightTo,
        ageFrom: ageOfPlayersFrom,
        ageTo: ageOfPlayersTo,
        orderDir: sortOrder,
        orderField: orderBy
      });
    }
  }

  uploadScoutDocument(file, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      const endpoint = environment.apiUrl + 'v1/api/userprofile/uploadTempScoutDocument';
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('userid', userid);
      return this.http.post(endpoint, formData);
    }
  }

  // User Status
  getUserStatus(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getUserStatus`, { userId: userid });
    }
  }
  // Guardian

  createGuardianRequest(athleteUserid, guardianUserid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/createGuardianRequest`,
        { athleteUserId: athleteUserid, guardianUserId: guardianUserid });
    }
  }

  getGuardianRequestsForGuardian(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGuardianRequestsForGuardian`,
        { userId: userid });
    }
  }

  getGuardianRequestsForAthlete(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGuardianRequestsForAthlete`,
        { userId: userid });
    }
  }
  acceptGuardianRequest(Id, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/acceptGuardianRequest`,
        { id: Id, userId: userid });
    }
  }
  cancelGuardianRequest(Id, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/cancelGuardianRequest`,
        { id: Id, userId: userid });
    }
  }
  cancelGuardianConnection(Id, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/cancelGuardianConnection`,
        { guardianUserId: Id, athleteUserId: userid });
    }
  }
  rejectGuardianRequest(Id, userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/rejectGuardianRequest`,
        { id: Id, userId: userid });
    }
  }
  getGuardedAthletes(userid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getGuardedAthletes`,
        { userId: userid });
    }
  }

  // Asserts
  getAssets(userid, skip, liMit, imagOrVid) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getAssets_temp`,
        { userId: userid, offset: skip, limit: liMit, type: imagOrVid });
    }
  }

  getAllAssets(userid, limitIn, offsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getAllAssests`,
        { user_id: userid,limit: limitIn, offset: offsetIn });
    }
  }
  getFilteredSports(sportId, limitIn, offsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getFilteredSports`,
        { sport_id: sportId, limit: limitIn, offset: offsetIn });
    }
  }
  getExploreAssets(postId, limitIn, offsetIn) {
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getExploreAssets`,
        { post_id: postId, limit: limitIn, offset: offsetIn });
    }
  }
  

  canConnect() {
    const x = JSON.parse(localStorage.getItem('online'));
    if (x === true) {
      return x;
    } else {
      // this.utilServ.presentToast('No Network');
      // // this.utilServ.userDetail = null;
      // this.utilServ.navLogin();
      return (() => {
        // return false;
        return exit(0);
      });
    }
    // return null;
  }
  payNowEmailLink(userid, payMode) {
    if (this.canConnect()) {
      this.connectFuntion();
      // console.log('did you goyt Email');
      return this.http.post(`${environment.apiUrl}v1/api/payment/getPaymentLink`, { userId: userid, mode: payMode });
    }
  }
  
  scoutStatusPayDoc(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      // console.log('did you goyt Email');
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getScoutStatus`, { userid: userId });
    }
  }
  getScoutPaymentStatus(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      console.log('did you goyt Email');
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getScoutPaymentStatus`, { userid: userId });
    }
  }
  
  getScoutFilePaymentStatus(userId) {
    if (this.canConnect()) {
      this.connectFuntion();
      console.log('did you goyt Email');
      return this.http.post(`${environment.apiUrl}v1/api/userprofile/getScoutFilePaymentStatus`, { userid: userId });
    }
  }
  createScoutPaymentRecord(orderid, createdAt, userId, mode, status){
    if (this.canConnect()) {
      this.connectFuntion();
      return this.http.post(`${environment.apiUrl}v1/api/payment/createFullPaymentRecord`, { 
      type: 'scout',
      status : status,
      transactionId: orderid,
      createdAt: createdAt,
      userId: userId,
      mode: mode });
    }
  }

}
