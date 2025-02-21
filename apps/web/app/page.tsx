import Card from "../component/ui/Card";
import ArrowRight from "../component/icons/Arrow-right";
import GroupIcon from "../component/icons/GroupIcon";
import PencilIcon from "../component/icons/PencilIcon";
import ShareIcon from "../component/icons/ShareIcon";
import Button from "../component/ui/Button";
import CircleIcon from "../component/ui/CircleIcon";
import HeaderLandingPage from "../component/ui/HeaderLandingPage";
import FooterLandingPage from "../component/ui/FooterLandingPage";

export default function Home() {
  return <div className="w-full h-full bg-[#313338]">
    <HeaderLandingPage/>
    <div className="flex flex-col items-center justify-center">
      <div className="text-white text-6xl mt-12">
        Collaborate and Brainstorm in Real-Time
      </div>
      <div className="flex flex-col text-white items-center justify-center text-xl mt-8">
        <span>
          Share your ideas instantly with a collaborative whiteboard that brings your 
        </span>
        <span>
          team's creativity together, no matter where they are.
        </span>
      </div>
      <div className="mt-8">
        <Button size="lg" text="Start Brainstorming" icon={<ArrowRight/>} type="primary"></Button>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="text-white text-5xl mt-12">
        Everything You Need to Collaborate
      </div>
      <div className="flex flex-col text-white items-center justify-center text-xl w-110 text-center mt-8">
        Powerful features that make brainstorming and ideation seamless for teams of all sizes.
      </div>
    </div>
    <div className="w-full mt-30 flex space-x-40 justify-center p-2">
      <Card>
        <div>
          <CircleIcon icon={<GroupIcon/>}></CircleIcon>
        </div>
        <div className="text-white text-xl p-2 text-center">
          Real-Time Collaboration
        </div>
        <div className="text-white text-base p-2 max-w-md mx-auto text-center">
          Work together with your team in real-time, seeing changes instantly as ideas flow.
        </div>
      </Card>
      <Card>
        <div>
          <CircleIcon icon={<ShareIcon/>}></CircleIcon>
        </div>
        <div className="text-white text-xl p-2">
          Easy Sharing
        </div>
        <div className="text-white text-base p-2 text-center max-w-md mx-auto">
          Share your whiteboard with a simple link, no sign-up required for viewers.
        </div>
      </Card>
      <Card>
        <div>
          <CircleIcon icon={<PencilIcon/>}></CircleIcon>
        </div>
        <div className="text-white text-xl p-2">
          Intuitive Tools
        </div> 
        <div className="text-white text-base p-2 text-center max-w-md mx-auto">
          Simple yet powerful drawing tools that anyone can use to express their ideas.
        </div>
      </Card>
    </div>
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-white text-5xl mt-12">
        Ready to Start Brainstorming?
      </div>
      <div className="flex flex-col text-white items-center justify-center text-xl w-110 text-center mt-8">
        Join thousands of teams who are already using Syncrosketch to bring their ideas to life.
      </div>
      <div className="mt-8">
        <Button size="lg" text="Get Started" type="primary"></Button>
      </div>
    </div>
    <FooterLandingPage/>
  </div>
  

}
