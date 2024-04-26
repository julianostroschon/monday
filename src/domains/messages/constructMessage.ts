import type { Model, Req } from "./types"

const MODEL = {
  pull_request: (req: any): Model => {
    const { pull_request: pr, repository, sender } = req
    console.log({ reviewer: pr.requested_reviewers })

    const reviewers = pr.requested_reviewers?.map((reviewer: any) => reviewer.login)
    const reviewersJoined = reviewers.join(', ')
    
    return {
      receivers: reviewers,
      message: `PR #(${pr.number}): ${pr.title}, on: ${repository.full_name}, by: ${sender.login}, url: ${pr.html_url}, reviewers: ${reviewersJoined}`
    }
  },
  check_run: (req: any): Model => {
    return {
      message: `Check: #${req.check_run.run_number} ${req.action}, on: ${req.repository.full_name}, by: ${req.sender.login}`
    }
  },
  workflow_run: (req: any): Model => {
    console.log({ req })
    return {
      message: `Workflow: ${req.action},
      #${req.workflow_run.run_number},
      on: ${req.repository.full_name},
      by: ${req.sender.login},
      body: ${Object.keys(req)}`
    }
  },
  pull_request_review_comment: (req: any): Model => {
    const evt = req[req.action]
    console.log({ evt })
    return {
      message: `PR Review: comment ${req.action}, on: ${req.repository.full_name}, by: ${req.sender.login}, body: ${evt?.body}` 
    }
  },
  check_suite: (req: any): Model => {
    console.log(req)
    return {
      message: `Check_suite: ${req.action}
      ${req.check_suite.conclusion},
      on: ${req.repository.full_name}, by: ${req.sender.login}`
    }
  },
  push: (req: any): Model => {
    console.log(req)
    return {
      message: `Push: ${req.action}, on: ${req.repository.full_name}, by: ${req.sender.login}`
    }
  },
  synchronize: (req: any): Model => {
    const { pull_request: pr, repository, sender } = req
    console.log({ reviewer: pr.requested_reviewers })

    const reviewers = getReviewers(pr)
    const reviewersJoined = reviewers.join(', ')
    
    return {
      receivers: reviewers,
      message: `Synchronize: ${req.action},
      on: ${repository.full_name}, by: ${sender.login}, to ${reviewersJoined}`
    }
  }
}
export async function constructMessage(request: Request): Promise<{ sender: string, message: string, receivers?: string[]}> {
  const req = await request.json<Req>()
  // const some = await fetch('https://263e-187-109-21-170.ngrok-free.app', { method: 'post', body: JSON.stringify(req), 
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // cf: { scrapeShield: false } })
  // console.log({ some })

  const { headers } = request;
  const eventName = headers.get('x-github-event') as keyof typeof MODEL;
  const allowedEvents = Object.keys(MODEL)
  if (!allowedEvents.includes(eventName)) {
    const message = `Evento não mapeado: ${eventName}, Objeto com chaves: ${Object.keys(req)}`
    console.log({ req })
    return { sender: 'unknown', message }
  }
  // const { sender, action, repository } = req;
  const result = MODEL[eventName](req)
  return { message:result.message, receivers: result?.receivers , sender: req.sender.login}
}


function getReviewers(pr: any): string[] {
  return pr.requested_reviewers?.map((reviewer: { login: string }): string => reviewer.login)
}