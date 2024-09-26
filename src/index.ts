import { URL } from 'url';
import { url_interface } from './metrics/interfaces.js'; 
import * as readline from 'readline';
import * as fs from 'fs';
import { Metrics } from './metrics/metrics.js';
import axios from 'axios';
import { error } from 'console';
import {log} from './logger.js'
import { fetch_repo, queries } from './api_handler/graphql_handler/analyzer_graphql.js';
import { headers } from './api_handler/graphql_handler/analyzer_graphql.js';
import { GRAPHQL_URL } from './api_handler/graphql_handler/analyzer_graphql.js';
import { emptyLogFile } from './logger.js';
import { exit } from 'process';
// Function to validate if the input is a valid URL
export function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

async function get_package_name (package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

async function getGitHubRepoUrl(package_name: string) {
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

async function fetchRepoUrl(package_url: string) {
    const package_name = await get_package_name(package_url);
    const gitHubUrl = await getGitHubRepoUrl(String(package_name));  // Output is assigned to gitHubUrl
    return gitHubUrl;
}
  

async function readLinesFromFile(file_path: string) {
    const fileStream = fs.createReadStream(file_path);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        await calculate_factors(line);
    }
}


// Logger function to output analysis results


export async function get_url_interface(urlInput:string):Promise<url_interface> {
    let url:url_interface;
    let parameters:queries |undefined;
    let metrics:Metrics | undefined;
    
    url = {
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
    try {
        // Call the fetchRepo function
        parameters = await fetch_repo(GRAPHQL_URL, headers, urlInput, 10);
        if (parameters) {
            metrics = new Metrics(url,parameters);
        }
        else {
            log("Couldn't locate parameters from repository",2,"ERROR")
            return url;
        }
    
        log("Parameters Found",1,"INFO")
        log("Calculating metrics",1,"INFO")
        metrics.calculate_bus_factor();
        metrics.calculate_correctness();
        metrics.calculate_rampup();
        metrics.calc_responsive_maintainer();
        metrics.calc_net_score();
        metrics.calc_license()
    
    } catch (error) {
        if (error instanceof Error) {
            log(`Error calling fetchRepo: ${error.message}`,2,"CRITICAL")
            process.exit(1)
        } else {
            log("Unknwon Error",2,"Error")
            process.exit(1);
            
        }
    }
    return url
}

export async function calculate_factors(urlInput:string) {
    if (isValidUrl(urlInput)) {
        //console.log(`The URL you provided is valid: ${urlInput}`);
    } 
    else {
        log("Invalid URL format",2,"ERROR")
        process.exit(1);
    }
        log("URL validation successful",1,"INFO");
        log("Starting Analysis",1,"INFO");

        // This if else statement checks if the link is a github link or a npm link, then calls the appropriate analyze functions.  Then it outputs the result.
    if(urlInput.includes("github.com")){
        log("Link is a GitHub URL",1,"INFO");
        let url:url_interface | undefined;
        url = await get_url_interface(urlInput);
        let data;
        // console.log("getting url")
        if (url) {
            data ={
                URL:urlInput,
                NetScore: url.net_score,
                NetScore_Latency: url.net_score_latency,
                RampUP:url.ramp_up,
                RampUp_Latency: url.ramp_up_latency,
                Correctness: url.correctness,
                Correctness_Latency: url.correctness_latency,
                BusFactor : url.bus_factor,
                BusFactor_Latency : url.bus_factor_latency,
                ResponsiveMaintainer : url.responsive_maintainer,
                ResponsiveMaintainer_Latency :url.responsive_maintainer_latency,
                License: url.license,
                License_Latency: url.license_latency,
            }
        }
        else {
            data = {}
        }
        const output = JSON.stringify(data);
        console.log(output);

        
    }
    else if (urlInput.includes("npmjs.com/package")) {
        //find eqvivalent github link and then call analyzeGraphQL();
        log("Link is an NPM URL",1,"INFO");

        // const npmResult = analyzeNpm();
        // console.log(npmResult);
        let url:url_interface | undefined;
        urlInput = String(fetchRepoUrl(urlInput))
        url = await get_url_interface(urlInput);
        let data;
        // console.log("getting url")
        if (url) {
            data ={
                URL:urlInput,
                NetScore: url.net_score,
                RampUP:url.ramp_up,
                Correctness: url.correctness,
                BusFactor : url.bus_factor,
                BusFactorLatency : url.bus_factor_latency,
                License: url.license,
            }
        }
        else {
            data = {}
        }
        const output = JSON.stringify(data);
        console.log(output);


    }
    else {
        log("This is neither a GitHub nor an npm url",2,"WARNING");
        process.exit(1);
        //console.log("This is neither a GitHub nor an npm link.");
        return;
    }     


}

// Main function to handle URL input from command line
async function main() {
    emptyLogFile();
    log("Starting Process",1,"INFO");
    const file_path = process.argv[2];
    try {
        await readLinesFromFile(file_path)
        log("All analyses complete",1,"INFO")
        process.exit(0);
    }

    catch (error) {
        if (error instanceof Error) {
            log(`Error during processing: ${error.message}`, 2, "ERROR");
        } else {
            log("An unknown error occurred during processing", 2, "ERROR");
        }
        process.exit(1); // Exit with failure code
    }
    
    
}


main()



/*
1. Writes test cases for empty files
2. Configure ./run test
3. Write the coverage percentage
4. Create error checking, add promises, add cases for if parameter cannot be extracted, exiting 0 and 1
5. Run in eceprog
*/

