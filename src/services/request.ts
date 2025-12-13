// 直接从 axios 导入官方类型定义，使用仅类型导入以符合 verbatimModuleSyntax
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelToken,
  CancelTokenSource,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

// 获取环境变量的工具函数
function isDevEnvironment(): boolean {
  // 使用 Vite 注入的环境变量来判断是否为开发环境
  // return import.meta?.env?.mode === 'development';
  // TODO
  return true;
}

// 单例模式的axios请求类
class Request {
  private static _instance: Request;
  private axios!: AxiosInstance; // 使用非空断言操作符
  private _cancelToken!: CancelTokenSource; // 使用非空断言操作符

  // 私有构造函数，防止外部直接实例化
  private constructor() {
    // 初始化axios配置
    this._initAxios();
  }

  // 获取单例实例
  public static getInstance(): Request {
    if (!Request._instance) {
      Request._instance = new Request();
    }
    return Request._instance;
  }

  // 初始化axios实例
  private _initAxios() {
    // 创建axios实例
    this.axios = axios.create({
      baseURL: 'https://insightweb.tartalabs.io',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this._cancelToken = axios.CancelToken.source();
  }

  // 初始化请求配置和拦截器
  public init({ baseUrl }: { baseUrl?: string }) {
    if (baseUrl) {
      this.axios.defaults.baseURL = baseUrl;
    }

    // 添加请求拦截器
    this.axios.interceptors.request.use(
      (options: InternalAxiosRequestConfig) => {
        // 添加Authorization头
        const token = this._getToken();
        if (token) {
          options.headers = options.headers || ({} as AxiosRequestHeaders);
          options.headers['authorization'] = `Bearer ${token}`;
        }
        return options;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // 添加响应拦截器
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        // 统一错误处理
        if (error.response?.status === 401) {
          // token过期处理
          // await this._refreshToken();
          // return this._retry(error.config);
        }

        // 调用错误处理函数
        this._handleError(error);
        return Promise.reject(error);
      },
    );

    // 添加日志拦截器（仅在开发环境）
    if (isDevEnvironment()) {
      this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        console.log('Request:', config.method?.toUpperCase(), config.url);
        console.log('Request Headers:', config.headers);
        return config;
      });

      this.axios.interceptors.response.use((response: AxiosResponse) => {
        console.log('Response:', response.status, response.config?.url);
        console.log('Response Data:', response.data);
        return response;
      });
    }
  }

  // 获取Token（模拟从存储中获取）
  private _getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // 清除Token
  private _clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  // GET请求方法
  public async get<T = unknown>(
    path: string,
    {
      params,
      options,
      cancelToken,
    }: {
      params?: Record<string, unknown>;
      options?: Partial<AxiosRequestConfig>;
      cancelToken?: CancelToken;
    } = {},
  ): Promise<T> {
    try {
      const response = await this.axios.get<T>(path, {
        params,
        ...options,
        cancelToken: cancelToken || this._cancelToken.token,
      });
      return response.data;
    } catch (e) {
      this._handleError(e as AxiosError);
      throw e;
    }
  }

  // POST请求方法
  public async post<T = unknown>(
    path: string,
    {
      data,
      params,
      options,
      cancelToken,
    }: {
      data?: unknown;
      params?: Record<string, unknown>;
      options?: Partial<AxiosRequestConfig>;
      cancelToken?: CancelToken;
    } = {},
  ): Promise<T> {
    try {
      const response = await this.axios.post<T>(path, data, {
        params,
        ...options,
        cancelToken: cancelToken || this._cancelToken.token,
      });
      return response.data;
    } catch (e) {
      this._handleError(e as AxiosError);
      throw e;
    }
  }

  // 上传图片方法
  public async uploadImage(uploadUrl: string, file: File): Promise<void> {
    try {
      // 创建独立的axios实例，避免主实例的拦截器和默认配置导致的CORS问题
      const uploadAxios = axios.create({
        timeout: 60000, // 上传超时时间设置长一些
        // 不设置baseURL，使用完整的uploadUrl
        // 不添加任何拦截器
      });

      // 使用PUT请求上传图片到预签名URL
      await uploadAxios.put(uploadUrl, file, {
        headers: {
          'Content-Type': 'image/jpg',
          'Content-Disposition': 'inline',
          'Cache-Control': 'max-age=3600',
          'x-amz-acl': 'public-read',
        },
        // 不发送凭证，避免CORS凭证问题
        withCredentials: false,
        cancelToken: this._cancelToken.token,
      });
    } catch (e) {
      this._handleError(e as AxiosError);
      throw e;
    }
  }

  // 错误处理函数
  private _handleError(error: AxiosError): void {
    let errorMsg = 'Request failed';

    // 超时处理 - 对应Dart的connectionTimeout、receiveTimeout、sendTimeout
    if (error.code === 'ECONNABORTED') {
      errorMsg = 'Request Timeout';
    }
    // 响应错误 - 对应Dart的badResponse
    else if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 401) {
        // 与Dart版本保持一致，401时清除token
        this._clearToken();
        // 可以在这里添加跳转到登录页面的逻辑
      }
      errorMsg = `Request failed: ${statusCode}`;
    }
    // 请求已发送但未收到响应 - 网络问题
    else if (error.request) {
      errorMsg = 'No response received from server';
    }
    // 请求被取消 - 对应Dart的cancel
    else if (error.message?.includes('cancelled')) {
      errorMsg = 'Request Cancelled';
    }

    // 与Dart版本保持一致，使用debugPrint级别输出错误信息
    console.error('HTTP Error:', errorMsg);

    // 在开发环境下打印详细错误信息
    if (isDevEnvironment()) {
      console.error('Detailed error:', error);
    }

    // 可以在这里添加错误上报逻辑
    // reportErrorToSentry(error);
  }
}

// 导出单例实例
const request = Request.getInstance();
// 初始化实例，使用原有的BaseURL
request.init({ baseUrl: 'https://insightweb.tartalabs.io' });

export { request };
