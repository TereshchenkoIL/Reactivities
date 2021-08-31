using System.Threading.Tasks;
using API.DTO;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        public ProfilesController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet("{username}")]     
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query {Username = username}));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(UserUpdateDto userUpdateDto)
        {
            return HandleResult(await Mediator.Send(new Update.Command()
            {
                DisplayName = userUpdateDto.DisplayName,
                Bio = userUpdateDto.Bio
            }));
        }
        
    }
}