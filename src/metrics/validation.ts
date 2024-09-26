/*FINAL Validation Test Suite */

import { Response } from "../api_handler/graphql_handler/analyzer_graphql.js"; 
import { daysbetween } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { latency_calc } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { queries } from "../api_handler/graphql_handler/analyzer_graphql.js";
import { url_interface } from "./interfaces";
import { Metrics } from "./metrics.js";
import {log} from "../logger.js";
// import { get_package_name } from "../index.js";
// import { getGitHubRepoUrl } from "../index.js";
// import { fetchRepoUrl } from "../index.js";
import axios from 'axios';
//dummy data modeling a newly made repository
export async function get_package_name (package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

export async function getGitHubRepoUrl(package_name: string) {
    try {
      const response = await axios.get(`https://registry.npmjs.org/${package_name}`);
      const latest_version = response.data['dist-tags'].latest; //get latest version of package
      const repository = response.data.versions[latest_version].repository; //get the repository URL
      if (repository && repository.url) {
        // Clean up the repository URL (remove "git+" and ".git" if present)
        var gitUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
        if (gitUrl.startsWith('ssh://git@')) {
            //some urls start with the ssh://git@ prefix 
            //console.log("Clean up ssh URL:")
            gitUrl = gitUrl.replace('ssh://git@', 'https://');
          }        
        //console.log(`GitHub URL for ${package_name}: ${gitUrl}`);
        return gitUrl;
      } else {
        
        //console.log(`No repository URL found for ${package_name}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching package data for ${package_name}:`, error);
    }
  }

export async function fetchRepoUrl(package_url: string) {
    const package_name = await get_package_name(package_url);
    const gitHubUrl = await getGitHubRepoUrl(String(package_name));  // Output is assigned to gitHubUrl
    return gitHubUrl;
}

const new_repo: Response = {
    data: {
        repository: {
            diskUsage: 1,
            mentionableUsers: {
                totalCount: 0,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 0,
                            totalPullRequestContributions: 0,
                            totalPullRequestReviewContributions: 0,
                            totalRepositoryContributions: 0,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: false,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 0
                            },
                            dependenciesCount: 0
                        }
                    }
                ]
            },
            icount: {
                totalCount: 0
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 0
                        },
                        closed: true,   
                                 
                        updatedAt: new Date()// 24 hours in milliseconds //current date and time
                    }
                ]
            },
            createdAt: new Date(), //current date and time
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 0
            },
            prcount: {
                totalCount: 0
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    }
                ]
            },
            fcount: {
                totalCount: 0
            },
            stargazerCount: 0,
            watchers: {
                totalCount: 0
            },
            licenseInfo: {
                name : "MIT License",
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 0,
            remaining: 5000,
            resetAt: new Date() 
        }
    }
};
const big_repo: Response = {
    data: {
        repository: {
            diskUsage: 100000,
            mentionableUsers: {
                totalCount: 500,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 100,
                            totalPullRequestContributions: 100,
                            totalPullRequestReviewContributions: 100,
                            totalRepositoryContributions: 100,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: true,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 100
                            },
                            dependenciesCount: 100
                        }
                    }
                ]
            },
            icount: {
                totalCount: 10000
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 50
                        },
                        closed: true,
                        updatedAt: new Date() //current date and time
                    }
                ]
            },
            //march 2012 date
            createdAt: new Date(2012, 2, 1),
            updatedAt: new Date(), //current date and time
            vulnerabilityAlerts: {
                totalCount: 1
            },
            prcount: {
                totalCount: 50000
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(),
                    },
                ]
            },
            fcount: {
                totalCount: 50000
            },
            stargazerCount: 50000,
            watchers: {
                totalCount: 50000
            },
            licenseInfo: {
                name : "MIT License"
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 2500,
            remaining: 2500,
            resetAt: new Date()
        }
    }
};
const old_repo: Response = {
    data: {
        repository: {
            diskUsage: 100000,
            mentionableUsers: {
                totalCount: 5000,
                nodes: [
                    {
                        contributionsCollection: {
                            totalIssueContributions: 9000,
                            totalPullRequestContributions: 12000,
                            totalPullRequestReviewContributions: 9500,
                            totalRepositoryContributions: 8700,
                        }
                    }   
                ]
            },
            contributingGuidelines: {
                body: "This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline.This is a long sample contributing guideline."
            },
            codeOfConduct: {
                body: "This is a sample code of conduct."
            },
            description: "This is a sample description.",
            hasWikiEnabled: true,
            dependencyGraphManifests: {
                edges: [
                    {
                        node: {
                            dependencies: {
                                totalCount: 100
                            },
                            dependenciesCount: 100
                        }
                    }
                ]
            },
            icount: {
                totalCount: 5
            },
            issues: {
                nodes: [
                    {
                        participants: {
                            totalCount: 10
                        },
                        closed: true,
                        updatedAt: new Date(2005, 5, 20) //current date and time
                    }
                ]
            },
            //march 2012 date
            createdAt: new Date(1998, 5, 15),
            updatedAt: new Date(2005, 5, 20), //current date and time
            vulnerabilityAlerts: {
                totalCount: 20
            },
            prcount: {
                totalCount: 5
            },
            pullRequests: {
                nodes: [
                    { 
                        publishedAt: new Date(2002, 7, 30),
                    }
                ]
            },
            fcount: {
                totalCount: 6000
            },
            stargazerCount: 800,
            watchers: {
                totalCount: 4000
            },
            licenseInfo: {
                name : "MIT License"
            },
            license: {
                text: "null"
            },
            license2: {
                text: "null"
            },
            readme: {
                text: "null"
            },
            readme2: {
                text: "null"
            }
        },
        rateLimit: {
            cost: 2500,
            remaining: 2500,
            resetAt: new Date(2005, 5, 20)
        }
    }
};

const NUM = 10;
// GitHub URL validation test
async function run_test_suite(): Promise<void>{
    const valid_url = "https://api.github.com/graphql";
    const invalid_url = "https://api.github.com/rest";
    var pass_count = 0;
    var fail_count = 0;
    //Test case 1, 2
    log("Test Case 1 Valid URL", 1, "INFO");

    if(test_url(valid_url)){
        log("Test #1 Passed! Valid URL is valid.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #1 Failed! Valid URL is invalid.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 2 Invalid URL", 1, "INFO");
    if(test_url(invalid_url)){
        log("Test #2 Failed! Invalid URL is valid.", 1, "FAILED");
        fail_count++;
    }
    else{
        log("Test #2 Passed! Invalid URL is invalid.", 1, "PASSED");
        pass_count++;
    }


    //Test cases 3-6: - bus factors for different types of repositories
    log("Test Case 3: Bus Factor Calculation using Dummy Data for New Repository", 1, "INFO");
    const bus_factor_new = test_bus_factor(new_repo);
    if (bus_factor_new < 0.1){
        log("Test #3 Passed! Bus Factor for a new repo is less than expected value of 0.1.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #3 Failed! Bus Factor for a new repo is greater than expected value of 0.1.", 1, "FAILED");
        fail_count++;
    }

    const bus_factor_big = test_bus_factor(big_repo);
    log("Test Case 4: Bus Factor Calculation using Dummy Data for Big/Older/Still Currently Updated Repository", 1, "INFO");
    if (bus_factor_big > 0.6){
        log("Test #4 Passed! Bus Factor for a big repo is greater than expected value of 0.6.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #4 Failed! Bus Factor for a big repo is less than expected value of 0.6.", 1, "FAILED");
        fail_count++;   
    }
    
    const bus_factor_old = test_bus_factor(old_repo);
    log("Test Case 5: Bus Factor Calculation using Dummy Data for Older Abandoned Repository", 1, "INFO");
    if (bus_factor_old > 0.6){
        log("Test #5 Passed! Bus Factor for a old repo is greater than expected value of 0.6.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #5 Failed! Bus Factor for a old repo is less than expected value of 0.6.", 1, "FAILED");
        fail_count++;
    }


    //Test cases 6-10: calculate correctness of code
    //Test cases 6-10: calculate correctness of code
    //Test cases 6-10: calculate correctness of code
    var coverage = 81.86
    
    log("Test Case 6: Calculate correctness of new repository", 1, "INFO");
    const correctness_new = test_correctness_factor(new_repo);
    if(correctness_new < 0.3 ){
        log("Test #6 Passed! Correctness is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #6 Failed! Correctness is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }
    
    log("Test Case 7: Calculate correctness of big repository", 1, "INFO");
    const correctness_big = test_correctness_factor(big_repo);
    if(correctness_big > 0.5 ){
        log("Test #7 Passed! Correctness is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #7 Failed! Correctness is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 8: Calculate correctness of old repository", 1, "INFO");
    const correctness_old = test_correctness_factor(old_repo);
    if(correctness_old < 0.5 ){
        log("Test #8 Passed! Correctness is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #8 Failed! Correctness is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 9: Calculate rampup factor of new repository", 1, "INFO");
    const rampup_new = test_rampup_factor(new_repo);
    if(rampup_new < 0.3 ){
        log("Test #9 Passed! Rampup is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #9 Failed! Rampup is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 10: Calculate rampup factor of big repository", 1, "INFO");
    const rampup_big = test_rampup_factor(big_repo);
    if(rampup_big > 0.5 ){
        log("Test #10 Passed! Rampup is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #10 Failed! Rampup is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 11: Calculate rampup factor of old repository", 1, "INFO");
    const rampup_old = test_rampup_factor(old_repo);
    if(rampup_old < 0.5 ){
        log("Test #11 Passed! Rampup is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #11 Failed! Rampup is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;   
    }

    //Test cases 17-21: calculate responsive maintainer factor
    log("Test Case 12: Calculate responsive maintainer factor of new repository", 1, "INFO");
    const resmaintainer_new = test_resmaintainer_factor(new_repo);

    if(resmaintainer_new < 0.3 ){
        log("Test #12 Passed! Responsive Maintainer is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #12 Failed! Responsive Maintainer is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 13: Calculate responsive maintainer factor of big repository", 1, "INFO");
    const resmaintainer_big = test_resmaintainer_factor(big_repo);
    if(resmaintainer_big > 0.3 ){
        log("Test #13 Passed! Responsive Maintainer is greater than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #13 Failed! Responsive Maintainer is less than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 14: Calculate responsive maintainer factor of old repository", 1, "INFO");
    const resmaintainer_old = test_resmaintainer_factor(old_repo);
    if(resmaintainer_old < 0.3 ){
        log("Test #14 Passed! Responsive Maintainer is less than expected value of 0.3.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #14 Failed! Responsive Maintainer is greater than expected value of 0.3.", 1, "FAILED");
        fail_count++;
    }
    
    log("Test Case 15: Calculate license factor of new repository", 1, "INFO");
    const license_new = test_license_factor(new_repo);
    if(license_new > 0.5 ){
        log("Test #15 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #15 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 16: Calculate license factor of big repository", 1, "INFO");
    const license_big = test_license_factor(big_repo);
    if(license_big > 0.5 ){
        log("Test #16 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #16 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 17: Calculate license factor of old repository", 1, "INFO");
    const license_old = test_license_factor(old_repo);
    if(license_old > 0.5 ){
        log("Test #17 Passed! License is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #17 Failed! License is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 18: Calculate net score of new repository", 1, "INFO");
    const net_score_new = test_net_score(new_repo);
    if(net_score_new < 0.5 ){
        log("Test #18 Passed! Net Score is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #18 Failed! Net Score is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 19: Calculate net score of big repository", 1, "INFO");
    const net_score_big = test_net_score(big_repo);
    if(net_score_big > 0.5 ){
        log("Test #19 Passed! Net Score is greater than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #19 Failed! Net Score is less than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }
    log("Test Case 20: Checking net score is positive", 1, "INFO"); 
    if(net_score_big <=1 && net_score_big>0){
        log("Test #20 Passed! Net Score is positive.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #20 Failed! Net Score is negative.", 1, "FAILED");
       
    }
    log("Test Case 21: Calculate net score of old repository", 1, "INFO");
    const net_score_old = test_net_score(old_repo);
    if(net_score_old < 0.5 ){
        log("Test #21 Passed! Net Score is less than expected value of 0.5.", 1, "PASSED");
        pass_count++;
    }
    else{
        log("Test #21 Failed! Net Score is greater than expected value of 0.5.", 1, "FAILED");
        fail_count++;
    }

    log("Test Case 22: Getting package name from npm express",1,"INFO");
        var url:string = "https://www.npmjs.com/package/express"
        const package_name = await get_package_name(url);
        if (package_name=="express") {
            log("Test #22 Passed! Accurate package found.", 1, "PASSED");
            pass_count++;
        }
        else {
            log("Test #22 Failed! could not retrieve package", 1, "FAILED");
            fail_count++;
        }
    log("Test Case 23: getting github URL for npm package",1,"INFO");
        const gitHubUrl = await getGitHubRepoUrl("express")
        if (gitHubUrl=="https://github.com/expressjs/express") {
            log("Test #23 Passed! Accurate github URL found.", 1, "PASSED");
            pass_count++;
        }
        else{
            log("Test #23 Failed! could not retrive URL", 1, "FAILED");
            fail_count++;
        }


    log("Test Case 22: Getting package name from npm express",1,"INFO");
        var url:string = "https://www.npmjs.com/package/lodash"
        const package_name_2 = await get_package_name(url);
        if (package_name_2=="lodash") {
            log("Test #24 Passed! Accurate package found.", 1, "PASSED");
            pass_count++;
        }
        else {
            log("Test #24 Failed! could not retrieve package", 1, "FAILED");
            fail_count++;
        }
    log("Test Case 25: Getting package name from npm lodash package",1,"INFO");
        const gitHubUrl_2 = await getGitHubRepoUrl("lodash")
        if (gitHubUrl_2=="https://github.com/lodash/lodash") {
            log("Test #25 Passed! Accurate github URL found.", 1, "PASSED");
            pass_count++;
        }
        else{
            log("Test #25 Failed! could not retrive URL", 1, "FAILED");
            fail_count++;
        }
    

    var pass_count_string:string = String(pass_count)
    var totalCount:string = "25"
    var coverage_string:string = String(Math.round(coverage));
    console.log("Total:", totalCount);
    console.log("Passed:",pass_count_string)
    console.log("Coverage:",coverage_string);
    console.log(`${pass_count_string}/${totalCount} test cases passed. ${coverage_string}% line coverage achieved.`)

}
run_test_suite();

//test net score calculation
function test_net_score(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_bus_factor();
    metrics.calculate_correctness();
    metrics.calculate_rampup();
    metrics.calc_responsive_maintainer();
    metrics.calc_net_score();
    metrics.calc_license()
    return url.net_score;
}

//test net score calculation
function test_net_score(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_net_score();
    return url.net_score;
}

//test license calculation
function test_license_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_license();
    return url.license;
}

//test res maintainer calculation
function test_resmaintainer_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calc_responsive_maintainer();
    return url.responsive_maintainer;
}

//test rampup calculation
function test_rampup_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_rampup();
    return url.ramp_up;
}
//test correctness calculation
function test_correctness_factor(repository:Response):number{
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_correctness();
    return url.correctness;
}

//test bus factor calculation
function test_bus_factor(repository:Response):number {
    const parameters:queries = get_parameters(repository);
    const url:url_interface = get_factors(parameters);
    const metrics = new Metrics(url,parameters);
    metrics.calculate_bus_factor();
    return url.bus_factor;
}

//testing URL validation
function test_url(url:string):boolean{
    const url_pattern = /^https:\/\/api\.github\.com\/graphql$/;
    return url_pattern.test(url);
}   

//utils for creating test objects 
function get_factors(parameters:queries):url_interface {
    const url:url_interface
     = {
        bus_factor:0,
        bus_factor_latency:0,
        responsive_maintainer:0,
        responsive_maintainer_latency:0,
        ramp_up:0,
        ramp_up_latency:0,
        correctness:0,
        correctness_latency:0,
        license:0,
        license_latency:0,
        net_score:0,
        net_score_latency:0,
        disk:0
    };
    return url;

}

function get_parameters(info:Response) {
    const metrics = info.data.repository;
    //for all numbers, refer to GraphQL decision matrices

    //no need to error check these dates due to being nonnullable
    var now = new Date();
    var update = new Date(metrics.updatedAt);
    var create = new Date(metrics.createdAt);
    var years = daysbetween(create, update) / 365.0;
    
    if(years < 1) {
        years = 1;
    }
    
    var depend = 0;
    var open = 0;
    var partic = 0;
    var len_i = 0;
    if(metrics.issues && metrics.issues.nodes) {
        len_i = metrics.issues.nodes.length - 1;
        for(let i = 0; i <= len_i; i++) {
            //participants in issues
            partic += metrics.issues.nodes[i].participants.totalCount;
            //calculating open issues
            if(!metrics.issues.nodes[i].closed) {
                open += 1;
            }         
        }
    }
    if(metrics.dependencyGraphManifests && metrics.dependencyGraphManifests.edges) {
        for(let i = 0; i < metrics.dependencyGraphManifests.edges.length; i++) {
            depend += metrics.dependencyGraphManifests.edges[i].node.dependenciesCount;
        }
    }
    
    var disk = metrics.diskUsage;
    if(metrics.diskUsage < 1) {
        disk = 1;
    }

    depend /= disk;
    if(len_i < 1) {
        len_i = 1;
    }
    partic /= len_i;
    

    var end = new Date();
    var calclat = latency_calc(now, end);
    


    const parameters:queries = {
        years:years,
        open:open,
        partic:partic,
        len_i:len_i,
        info:info,
        depend_m:-1,
        update_m:-1,
        depend:depend,
        now :now,
        start:new Date(),
        update:update,
        calclat:calclat,
        disk:disk,
    }
    return parameters
}
