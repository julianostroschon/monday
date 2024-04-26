type PR = {
  title: string,
  number: number
}

export interface Req {
	action: string
	number: number
  pull_request: PR
	repository: {
		full_name: string
		url: string
	}
	sender: {
		login: string
	}
}

export interface Model {
  receivers?: string[]
  message: string
}