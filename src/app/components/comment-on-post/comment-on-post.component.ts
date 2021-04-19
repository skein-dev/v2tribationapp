import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';



@Component({
  selector: 'app-comment-on-post',
  templateUrl: './comment-on-post.component.html',
  styleUrls: ['./comment-on-post.component.scss'],
})

export class CommentOnPostComponent implements OnInit {
  @ViewChild('content') private content: any;

  @ViewChild('inputComment') inputComment: any;
  postData: any;
  userDetail: any;
  environment: any;
  ifComment = false;
  commentData: any[] = [];
  commentText: string;
  replyData: any;
  temp;
  replyAdded = 0;
  commentAdded = 0;

  // String
  noCommentsString = 'No comments';
  replyString = 'Reply';
  replysString = 'Reply\'s';
  leaveCommentString = 'Leave a comment';

  constructor(
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    public socketAPI: Socket,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.postData = JSON.parse(localStorage.getItem('commentOnPost'));
      this.getCommentData();
      this.getLanguageStrings();
      // console.log('COnst');
    });
  }

  ngOnInit() {
    this.environment = environment;
  }
  ionViewWillEnter() {
    this.replyAdded = 0;
    this.commentAdded = 0;
  }
  getCommentData() {
    // console.log('data');
    this.apiService.getsharelikecommentpost(this.userDetail.id, this.postData.postId).subscribe((commentRes: any) => {
      // console.log(commentRes.message);
      const x = commentRes.message.commentData.comments;
      x.forEach(e => {
        e.showReply = false;
        this.commentData.push(e);
        // console.log(e);
      });
      if (this.commentData.length > 0) {
        this.ifComment = true;
      } else {
        this.ifComment = false;
      }
      // console.log('commentData', this.commentData);
    });
  }
  logScrolling(x) { }
  loadReply(x) {
    this.commentData[x].showReply = !(this.commentData[x].showReply);
  }
  trimText() {
    // console.log('this.commentText', this.commentText);
    this.commentText = this.utilServ.formatString(this.commentText);
  }
  replyToComment(commentId, commenterUser, comment, x) {

    this.replyData = {
      commeNtId: commentId,
      commenTer: commenterUser,
      commeNt: comment,
      serial: x
    };
  }
  rootUser(userId) {
    this.router.navigate([`profile/${userId}`]);
  }
  postComment() {
    this.trimText();
    this.trimText();
    if (this.commentText !== '' && this.commentText !== null && this.commentText) {
      if (this.replyData) {

        this.apiService.addReply(
          this.userDetail.devicetoken,
          this.postData.postId,
          this.commentText,
          this.userDetail.id,
          this.replyData.commeNtId,
          this.replyData.commenTer.id).subscribe((res: any) => {
            if (res.success === 1) {

              // const replyData = {
              //   user_id: this.userDetail.id,
              //   poster_id: this.replyData.commenTer.id
              // };
              // this.socketAPI.emit('reply-event', replyData);

              this.replyAdded += 1;
              const timeStamp = this.utilServ.getTimeStamp();
              const reply = {
                r_first_name: this.userDetail.first_name,
                r_id: this.userDetail.id,
                r_last_name: this.userDetail.last_name,
                r_profile_img_url: this.userDetail.profile_img_url_thump,
                reply_content: this.commentText,
                reply_created: timeStamp
              };
              const i = this.replyData.serial;
              this.commentData[i].replys.push(reply);
              // console.log(this.commentData);
              this.replyData = null;
              this.commentText = null;


            }
          });
      } else {
        this.apiService.addComment(
          this.userDetail.devicetoken,
          this.postData.postId,
          this.commentText,
          this.userDetail.id,
          this.postData.userId
        ).subscribe((res: any) => {
          // console.log(this.commentData);
          // console.log(res);
          if (this.commentData.length === 0) {
            this.getCommentData();
            this.commentText = null;
          } else {
            if (res.success === 1) {

              // const commentData = {
              //   user_id: this.userDetail.id,
              //   poster_id: this.postData.userId
              // };
              // this.socketAPI.emit('comment-event', commentData);

              this.commentAdded += 1;
              const comment = res.message[0];
              const temp = {
                comment: comment.comment,
                created: comment.created,
                id: comment.id,
                replys: [],
                showReply: false,
                user: {
                  first_name: comment.first_name,
                  last_name: comment.last_name,
                  id: comment.user_id,
                  profile_img_url: comment.profile_img_url
                }
              };
              setTimeout(() => {
                this.commentData.push(temp);
                this.commentText = null;
                setTimeout(() => {
                  this.content.scrollToBottom(80);
                }, 200);
              }, 150);
            }
          }
        });
      }
      // console.log(
      //   '\ntoken', this.userDetail.devicetoken,
      //   '\npost_id', this.postData.postId,
      //   '\nreply_content', this.commentText,
      //   '\nuser_id', this.userDetail.id,
      //   '\npost_user_id', this.postData.userId,
      //   '\n',
      //   this.replyData);
    }
  }
  setFocus(nextElement) {
    nextElement.setFocus();
  }

  close() {
    // this.getCommentData();
    const temp = {
      comment: this.commentAdded,
      reply: this.replyAdded
    };
    // console.log(this.commentData);
    this.modalController.dismiss({
      dismissed: true,
      data: temp
    });
  }
  getTimeFromNow(createdDate) {
    return moment(createdDate).fromNow();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.replyString = this.utilServ.getLangByCode('post_reply');
      this.replysString = this.utilServ.getLangByCode('post_replys');
      this.leaveCommentString = this.utilServ.getLangByCode('leave_a_comment');
      this.noCommentsString = this.utilServ.getLangByCode('noCommentsString');
    }
  }
}
