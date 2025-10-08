import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1 } from "@/components/govuk/GovHeading";
import SearchTemplate from "@/templates/SearchTemplate";

export default function Home() {
  return (
    <>
      <GovHeader serviceName="Find a court or tribunal" />
      <main className="govuk-main-wrapper" id="main-content" role="main">
        <GovContainer>
          <GovH1>Find a court or tribunal</GovH1>
          <SearchTemplate />
        </GovContainer>
      </main>
    </>
  );
}
