import axios from 'axios';

interface TunnelResponse {
  url: string;
  cached: boolean;
  lastChecked: string;
}

interface TunnelErrorResponse {
  error: string;
  fallbackUrl?: string;
}

class ProductionEndpointResolver {
  private static instance: ProductionEndpointResolver;
  private cachedEndpoint: string | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 300000; // 5 minutes for production
  
  // Production API URLs
  private readonly PRODUCTION_API_URL = process.env.REACT_APP_API_URL || 'https://your-api.railway.app/api';
  private readonly TUNNEL_MANAGER_URL = process.env.REACT_APP_TUNNEL_MANAGER_URL || 'https://tunnel-manager.railway.app';
  private readonly FALLBACK_API_URL = 'http://localhost:8080/api';

  private constructor() {}

  public static getInstance(): ProductionEndpointResolver {
    if (!ProductionEndpointResolver.instance) {
      ProductionEndpointResolver.instance = new ProductionEndpointResolver();
    }
    return ProductionEndpointResolver.instance;
  }

  public async getApiEndpoint(): Promise<string> {
    // Return cached endpoint if still valid
    if (this.cachedEndpoint && Date.now() < this.cacheExpiry) {
      return this.cachedEndpoint;
    }

    // In production, try production API first
    if (process.env.REACT_APP_ENV === 'production') {
      try {
        await axios.get(`${this.PRODUCTION_API_URL}/health`, { timeout: 5000 });
        this.cachedEndpoint = this.PRODUCTION_API_URL;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        console.log('✅ Using production API:', this.PRODUCTION_API_URL);
        return this.PRODUCTION_API_URL;
      } catch (error) {
        console.warn('⚠️ Production API unavailable, trying tunnel manager...');
      }
    }

    // Try tunnel manager for dynamic ngrok URLs
    try {
      const response = await axios.get<TunnelResponse>(`${this.TUNNEL_MANAGER_URL}/api/tunnel-url`, {
        timeout: 5000
      });
      
      const apiUrl = response.data.url + '/api';
      
      // Verify the tunnel URL is working
      await axios.get(`${apiUrl}/health`, { timeout: 3000 });
      
      this.cachedEndpoint = apiUrl;
      this.cacheExpiry = Date.now() + (this.CACHE_DURATION / 5); // Shorter cache for tunnels
      
      console.log('✅ Using tunnel API:', apiUrl);
      return apiUrl;
      
    } catch (error) {
      console.warn('⚠️ Tunnel manager unavailable:', error);
      
      // Try to get fallback URL from error response
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as TunnelErrorResponse;
        if (errorData.fallbackUrl) {
          const fallbackApiUrl = errorData.fallbackUrl + '/api';
          console.log('🔄 Using tunnel fallback:', fallbackApiUrl);
          return fallbackApiUrl;
        }
      }
    }

    // Final fallback to localhost (for development)
    console.log('🔄 Using localhost fallback:', this.FALLBACK_API_URL);
    return this.FALLBACK_API_URL;
  }

  public clearCache(): void {
    this.cachedEndpoint = null;
    this.cacheExpiry = 0;
  }

  // Method to manually set endpoint (useful for development/testing)
  public setEndpoint(endpoint: string): void {
    this.cachedEndpoint = endpoint;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
  }

  // Get current cached endpoint without resolving
  public getCachedEndpoint(): string | null {
    return this.cachedEndpoint;
  }

  // Check if we're in production mode
  public isProduction(): boolean {
    return process.env.REACT_APP_ENV === 'production';
  }

  // Get environment info for debugging
  public getEnvironmentInfo(): object {
    return {
      environment: process.env.REACT_APP_ENV || 'development',
      productionApiUrl: this.PRODUCTION_API_URL,
      tunnelManagerUrl: this.TUNNEL_MANAGER_URL,
      cachedEndpoint: this.cachedEndpoint,
      cacheValid: Date.now() < this.cacheExpiry
    };
  }
}

export default ProductionEndpointResolver;
