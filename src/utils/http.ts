enum METHOD {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
}

type HttpConfig = {
	baseUrl?: string;
	defaultHeaders?: HeadersInit;
	includeCSRF?: boolean;
	secureMode?: boolean;
};

type Options = {
	body?: any;
	headers?: HeadersInit;
};

type HttpResult<T, E> = {
	status: number;
	ok: boolean;
	data: T | null;
	error: E | null;
};

export class HttpClient {
	private baseUrl?: string;
	private defaultHeaders?: HeadersInit;
	private includeCSRF?: boolean;
	private secureMode?: boolean;

	constructor(config?: HttpConfig) {
		Object.assign(this, config);
		// this.baseUrl = config?.baseUrl;
		// this.defaultHeaders = config?.defaultHeaders;
		// this.includeCSRF = config?.includeCSRF;
		// this.secureMode = config?.secureMode;
	}

	getHeaders(header?: HeadersInit) {
		return this.defaultHeaders ? { ...this.defaultHeaders, ...header } : header;
	}

	getUrl(url: string): string {
		return this.baseUrl ? `${this.baseUrl}/${url}` : `/${url}`;
	}

	async get<T, E>(
		url: string,
		{ headers }: Options,
	): Promise<HttpResult<T, E>> {
		return this.request<T, E>(url, {
			headers,
		});
	}

	async post<T, E>(url: string, options: Options): Promise<HttpResult<T, E>> {
		return this.request<T, E>(url, options, METHOD.POST);
	}

	async put<T, E>(url: string, options: Options): Promise<HttpResult<T, E>> {
		return this.request<T, E>(url, options, METHOD.PUT);
	}

	async delete<T, E>(url: string, options: Options): Promise<HttpResult<T, E>> {
		return this.request<T, E>(url, options, METHOD.DELETE);
	}

	private async request<T, E>(
		url: string,
		opts: Options,
		method: string = METHOD.GET,
	): Promise<HttpResult<T, E>> {
		const headers =
			(this.getHeaders(opts.headers) as Record<string, string>) || {};
		// if (method !== METHOD.GET) {
		// 	headers["X-CSRFToken"] = getCsrfToken() as string;
		// }
		if (opts.body && !(opts.body instanceof FormData)) {
			headers["Content-Type"] = "application/json";
		}

		const init: RequestInit = {
			method,
			headers,
			credentials: "same-origin",
			...(this.secureMode ? { mode: "same-origin" as RequestMode } : {}),
		};

		switch (true) {
			case opts.body instanceof FormData:
				init.body = opts.body;
				break;

			default:
				init.body = JSON.stringify(opts.body);
				break;
		}

		let response: Response;
		try {
			response = await fetch(this.getUrl(url), init);
			const contentType = response.headers.get("content-type") || "";
			let data: any;

			switch (true) {
				case contentType.includes("text/html"):
					data = await response.text();
					break;
				case contentType.includes("application/json"):
					data = await response.json();
					break;

				default:
					data = await response.blob();
					break;
			}

			return {
				status: response.status,
				ok: response.ok,
				data: data,
				error: !response.ok ? data : null,
			};
		} catch (err: any) {
			return {
				status: 0,
				ok: false,
				data: null,
				error: err.message || "Erro de rede",
			};
		}
	}
}

export const http =  new HttpClient()