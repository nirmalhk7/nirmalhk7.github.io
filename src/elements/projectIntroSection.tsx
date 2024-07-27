
import React from "react";
import {
    Accordion,
    AccordionItem,
    AccordionItemPanel,
    AccordionItemHeading,
    AccordionItemButton,
} from "react-accessible-accordion";
import Utils from "../elements/utils";
import ProjectInterface from "../interfaces/projectInterface";
import Link from "next/link";

interface ProjectIntroSectionInterface {
    childMarkdownRemark: ProjectInterface,
    id: string,
    slug: string
}

const ProjectIntroSection = ({ projects }: { projects: ProjectIntroSectionInterface[] }) => (
    <section className="bg-gray selection:bg-accent selection:text-white" id="projects">
        <div className="mobile-l:container mx-auto">
            <div className="grid grid-cols-2  tablet:grid-cols-2 mobile-l:grid-cols-1">
                <div>
                    <div className="pb-6 relative">
                        <div className=" text-center">
                            <h3 className="font-blocky font-semibold mb-0 mt-0 uppercase text-accent">
                                Projects
                            </h3>
                            <h1 className="font-bold  font-heading leading-snug mt-0">
                                See My Latest Projects
                            </h1>
                            <p className="lead">
                                Find my projects{" "}
                                <Link href="/projects">categorized here</Link>.
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <Accordion className="accordion">
                        {projects.map((element) => (
                            <AccordionItem
                                className="accordion__item"
                                key={Utils.getFrontmatter(element).title}
                            >
                                <AccordionItemHeading>
                                    <AccordionItemButton className="accordion-header">
                                        {Utils.getFrontmatter(element).title}
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel className="p-6 bg-white">
                                    <div className="accordion-body__contents">
                                        <p>{element.childMarkdownRemark.excerpt}</p>
                                        <Link href={`/projects?id=${element.id}`}>
                                            Find more here
                                        </Link>
                                        .&nbsp;&nbsp;&nbsp;
                                        <code>{Utils.getFrontmatter(element).tags[0]}</code>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    </section>
);

export default ProjectIntroSection;