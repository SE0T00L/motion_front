import React from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../Css/common.css';
import '../Css/board.css';
import * as cookies from './Common/Cookies';
import Pagination from './Common/Pagination';
import * as boardService from '../Services/board';

const Board = class extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className="fullWidth">
        <Header />
        <BoardHeader />
        <BoardContents
          offset={props.match.params.offset}
          limit={props.match.params.limit}
        />
        <Footer />
      </div>
    );
  }
};

const BoardHeader = () => (
  <div className="fullWidth boardHeaderDiv">
    <div className="boardTextDiv">
      <div className="boardHeaderTitle robotoFont"> Board </div>
      <div className="boardHeaderSubTitle notoSansFont"> 게시판 </div>
    </div>
  </div>
);

const BoardContents = class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userRoll : null,
        }
    }

    componentDidMount(): void {
        this.setState({userRoll : cookies.getCookie("userRoll")});
        this.getPosts(this.props.offset, this.props.limit);
    }

    addNewPost = () => {
      window.location.href = '/board/new';
    }

    getPosts = (offset, limit) => {
      boardService.getPosts(offset, limit)
        .then((response) => {
          const posts = response.data;
          if (posts == null) {
            this.printNoPost();
            return;
          }
          this.printPosts(posts);
        })
        .catch(() => {
          // Todo : Below is temporary.
          // If you get error, you have to confirm error to user. (console.log)
          this.printNoPost();
        });
    }

    printPosts = (posts) => {
        const tbody = document.getElementById("boardTableBody");
        tbody.innerHTML = '';
        for (let i=0; i<posts.length; i++) {
            let postNo = this.createThElement("postNo", posts[i].order); // Todo : DB에서 orderby해서 최신순으로 게시물 번호를 매겨서 return 해야함!
            let postTitle = this.createThElement("postTitle", posts[i].title);
            let postAuthor = this.createThElement("postAuthor", posts[i].userName); // Todo : DB에서 userId로 조인해서 유저의 이름을 알아와야함
            let postDate = this.createThElement("postDate", posts[i].registerDate);

            let tr = document.createElement('tr');
            tr.appendChild(postNo);
            tr.appendChild(postTitle);
            tr.appendChild(postAuthor);
            tr.appendChild(postDate);

            tbody.appendChild(tr);
        }
    }

    createThElement = (className, content) => {
        let thElement = document.createElement('th');
        thElement.setAttribute('className', className);
        thElement.innerText = content;

        return thElement;
    }

    printNoPost = () => {
      document.getElementById('boardTableBody').innerHTML = '<tr> <td colspan=\'4\'>등록된 게시글이 없습니다</td> </tr>';
    }

    render() {
      return (
        <div className="contents boardContentsDiv">
          <div className="boardContentTitle">게시판</div>
          <div className="boardContentComment notoSansFont">건의사항, 교육문의 등 자유롭게 질문해 주세요 :-)</div>
          <div className="newPostButtonDiv fullWidth" style={{ display: (this.state.userRoll != null) && (this.state.userRoll === 'ADMIN') ? 'block' : 'none' }}>
            <button className="newPostButton notoSansFont" type="button" onClick={this.addNewPost}>글쓰기</button>
          </div>
          <div className="boardTableDiv">
            <table className="table">
              <thead>
                <tr>
                  <th className="postNo">번호</th>
                  <th className="postTitle">제목</th>
                  <th className="postAuthor">작성자</th>
                  <th className="postDate">등록일</th>
                </tr>
              </thead>
              <tbody id="boardTableBody">
                <tr>
                  <th className="postNo">1</th>
                  <td className="postTitle">콜라톤관련 문의드립니다.</td>
                  <td className="postAuthor">김가연</td>
                  <td className="postDate">2019.09.29</td>
                </tr>
                <tr>
                  <th className="postNo">2</th>
                  <td className="postTitle">컴파일러 과제 아시는분 구합니다!!!</td>
                  <td className="postAuthor">이정준</td>
                  <td className="postDate">2019.08.29</td>
                </tr>
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
      );
    }
};
export default Board;
