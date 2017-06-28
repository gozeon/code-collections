import React from 'react';
import {GridList} from 'material-ui/GridList';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';

export default class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      checked: undefined,
      docked: true
    }
  }

  handleToggle = () => {
    this.setState({open: !this.state.open});
  };

  render() {
    return (
      <div>
        <AppBar style={{position: "fixed"}} onLeftIconButtonTouchTap={this.handleToggle}/>
        <Drawer open={this.state.open} docked={this.state.docked} onRequestChange={(open)=> {
          this.setState({open: open})
        }}>
          <AppBar title="Developer" onLeftIconButtonTouchTap={this.handleToggle}/>
          <Menu onItemTouchTap={(event, menuItem, index)=> {
            this.setState({checked: index})
          }}>
            <MenuItem primaryText="Overview"
                      insetChildren={true}
                      checked={(this.state.checked == 0)}
            />
            <MenuItem primaryText="Source"
                      insetChildren={true}
                      checked={(this.state.checked == 1)}
            />
            <MenuItem primaryText="Commits"
                      insetChildren={true}
                      checked={(this.state.checked == 2)}
            />
            <MenuItem primaryText="Branches"
                      insetChildren={true}
                      checked={(this.state.checked == 3)}
            />
            <MenuItem primaryText="Pull request"
                      insetChildren={true}
                      checked={(this.state.checked == 4)}
            />
            <MenuItem primaryText="Issues"
                      insetChildren={true}
                      checked={(this.state.checked == 5)}
            />
          </Menu>
        </Drawer>
        <GridList style={{paddingTop: 100, justifyContent: "center"}}>
          <div>
            <h1>少林传奇</h1>
            <br/>
            蓝天－－少林俗家弟子，陈于少林寺习武艺成后下山协助父亲将“天下第一玉石”送献皇上，不料被奸人所害父亲被打入死牢，蓝天血战后逃回少林再次修炼，凭自己的天赋和方丈的帮助参透了至高心法“易筋经”和至刚外功“形意拳”。
            蓝天一路追踪，强敌如云－－少林弃徒仰天笑、哭无泪、江湖豪客蓝霸天、阴险狡诈<br />
            李铁扇……蓝天艰难昌地一步步接近天字第一号阴谋的中心……<br />
            ●少林寺全球独家授权制作监制<br />
            ●全面揭秘少林七十二绝技、易筋经、罗汉拳、形意拳、般若功…… <br />
            ●人物造型创新，场面凡宏大，二百四十场打斗场面刺激过瘾<br />
            ●高端数码动画，荣获大连国际数码艺术节大奖 <br />
            ●内地各大电视台即将陆续热播 <br />
            ●《少林传奇》网络游戏即将全面公测，注册用户超过500万人次 内赠“龙、虎、豹、蛇、鹤”五形拳精美书签。<br />


            悟道休言天命，<br />
            修行勿取真经。<br />
            一悲一喜一枯荣,<br />
            哪个前生注定？<br />
            袈裟本无清净，<br />
            红尘不染性空。<br />
            幽幽古刹千年钟，<br />
            都是痴人说梦。<br />
            故事梗概编辑<br />
            一个叫王富贵的千年狐狸，一个比人更有人味儿的花妖，一只特别没谱的兔子，三个妖精碰到一个落难太子的故事，也不知他们到底谁救了谁。 <br />
            一个讲感情和时光的故事，人的寿命几十年，妖的寿命几千年，感情有什么不同？时光有什么不同？“永远”这两个字有什么不同？<br />
            一个生命的故事，物种不一样，位置不一样，阶级不一样，经历不一样，背景不一样，我们如何看待这个世界？我们如何对待彼此？<br />
            一个讲缘分的故事，什么是“因果”？什么是“成全”？<br />
            一个人间的故事，你、我、他……万物之灵，芸芸众生<br />
            也曾荒唐，也曾情深似海。<br />
            主创团队编辑<br />
            出品方：北京拓普天仕文化传有限公司-121舞台工作室<br />
            出品人：刘乃畅，陈奕名<br />
            导演：戴明宇<br />
            编剧/音乐：红料<br />
            艺术总监：李亦燃<br />
            演员：张鑫 马卓君 袁福福 吴哲萱 史晓僮<br />
            灯光设计：沙峰[1] <br />
            造型设计：秦明雷<br />
            服装设计：唐慈蔓<br />
            音效设计：小贝<br />
            平面设计：李峰<br />
            音响控制：王敬棋<br />
            灯光控制：杨帆<br />
            市宣传广：黄万丽<br />
            制作助理：张跃<br />
            推荐理由编辑<br />
            2013年北京小剧场优秀剧目展演作品[2] <br />
            2014年乌镇戏剧节特邀参演剧目<br />
            精彩亮点编辑<br />
            1、 原创荒诞类古装悲喜剧；<br />
            2、音乐人红料编剧，同时也是剧中三首原创歌曲唱作者，其中两首歌曲由史航、东东枪作词；<br />
            3、《我爱我家》、《天龙八部》编剧戴明宇执导；<br />
            4、该剧受到文艺界多名著名文艺学者的关注与参与，金武林、史航、东东枪、王自健、秋野、蒋方舟等曾参与客串演出；<br />
            舆论及媒体评论编辑<br />
            “红料的剧作让人惊喜。简单、深情，有趣，不拧巴，不装深沉，不玩先锋。”<br />
            ——胡淑芬<br />
            “《从前有座庙》是一个颇具颠覆性的人妖恋的神话故事，表现手法带有漫画日和与九点半花系列的风范，但都不影响爱情的主题在笑声戛然而止的那刻，藉由渐暗的光线与‘不得已的离别’曲而催人落泪。”<br />
            ——Underland<br />
            “看完红料编剧的《从前有座庙》，笑中带泪。一个会讲故事的歌手杀到话剧舞台上，起评分太高，加上特别抢戏的兔子和土地奶奶，还有每天不同的仙官当彩蛋，这个戏可称得上薄皮大馅十八个褶儿，快来品尝吧！”<br />
            ——纳兰性急<br />
            “多少唏嘘，不如哭泣，千般颜色，不如迷离，原来命运，写在今生此际是多么多么，可终于终于……终可再相遇了，狐狸王大爷，兔子小翠，太子爷，桃子姑娘，土地奶奶，两位仙官，人间已做好准备，承受你们的悲喜来去。”<br />
            ——史航<br />
            “所谓灵感，不过是带着较劲心理的一次偷情。我独坐剧场二楼，像个盗贼那样瞄着人群，有鲜花和掌声。习惯了人声鼎沸之余消失。夜、琢磨、烟。打点行囊，收拾细软，藏戾气，散豪情，灭情欲，毁杂念，三日过，是启程，亦是离别。”
            ——李亦燃<br />
            “再美好的感情都需要找个人来承载，于是我们对爱情心生幻想，希望它超越种族、超越门第、超越年龄、超越一切障碍，无论两个人的条件多么不同，终将会相爱。这就是话剧《从前有座庙》所要阐述的道理。”
            ——《北京广播网》<br />
            剧照
            剧照(8张)


          </div>
        </GridList>
      </div>
    );
  };

  updateDimensions = () => {

    var w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    // height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

    if (width <= 1024) {
      this.setState({open: false,docked: false});
    } else {
      this.setState({open: true,docked: true});
    }

  };

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
}
